const bleno = require('bleno'); // for implementing BLE peripheral
const Pusher = require('pusher'); // for pushing real-time updates to clients
const dateFormat = require('dateformat'); // for formatting dates

const FirebaseDB = require('./firebase/FirebaseController')

const PERIPHERAL_ID = `${process.env.PERIPHERAL_ID}`;
const PRIMARY_SERVICE_ID = `${process.env.PRIMARY_SERVICE_ID}`;
const PRIMARY_CHARACTERISTIC_ID = `${process.env.PRIMARY_CHARACTERISTIC_ID}`;
const BASE_UUID = `${process.env.BASE_UUID}`;


require('dotenv').config();


var pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  encrypted: true
})

var settings = {
  service_id: PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID,
  characteristic_id: PERIPHERAL_ID + PRIMARY_CHARACTERISTIC_ID + BASE_UUID
}

bleno.on('stateChange', function (state) {
  if (state !== 'poweredOn') {
    bleno.stopAdvertising()
    return
  }

  bleno.startAdvertising(
    process.env.RESTAURANT_NAME,
    [settings.service_id],
    (err) => console.log(err)
  )
})

bleno.on('advertisingStart', function (error) {
  if (error) {
    console.log('Advertising Error..')
    return
  }

  console.log('Advertising Start..');

  bleno.setServices([

    new bleno.PrimaryService({
      uuid: settings.service_id,
      characteristics: [

        new bleno.Characteristic({
          value: null,
          uuid: settings.characteristic_id,
          properties: ['write'],
          onWriteRequest: function (data, offset, withoutResponse, callback) {
            console.log('Write Request..');

            FirebaseDB.createOrder(data)
              .then((data) => {
                console.log('Success Create Order Firebase', data)
                pusher.trigger(process.env.CHANNEL_NAME, process.env.EVENT_NAME, data)
                callback(this.RESULT_SUCCESS)
              })
              .catch((err) => {
                console.error('Failed Create Order Firebase', err)
                // callback(this.RESULT_FAILED)
              })

          }
        })

      ]
    })

  ]);
});

bleno.on('accept', function (clientAddress) {

  FirebaseDB.getRestaurantData(process.env.RESTAURANT_ID)
    .then((data) => {
      pusher.trigger(data.name, process.env.EVENT_NAME, data);
    })
    .catch((err) => {
      console.error('eror Firebase', err)
    })

});
