const bleno = require('bleno');
const mongoose = require('mongoose');

//Constanta
const constants = require('./src/configs/Constants')
const settings = require('./src/configs/BleConfiguration')
const pusher = require('./src/configs/PusherConfiguration')

//Controllers
const CachedController = require('./src/controllers/CachedController')


require('dotenv').config();
mongoose.connect('mongodb://dominicusrobert7:password1234567890@ds223609.mlab.com:23609/momakan');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('CONNECT TO MONGOOSE');
});


bleno.on('stateChange', function (state) {
  if (state !== 'poweredOn') {
    bleno.stopAdvertising()
    return
  }

  bleno.startAdvertising(
    `${process.env.RESTAURANT_NAME}`,
    [settings.service_id],
    (err) => console.error('Start Advertising error', err)
  )
})

bleno.on('advertisingStart', function (error) {
  if (error) {
    console.error('Advertising Error..')
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
        
            // FirebaseDB.createOrder(data)
            //   .then((data) => {
            //     console.log('Success Create Order Firebase', data)
            //     pusher.trigger(process.env.CHANNEL_NAME, constants.EVENT_ORDER, data)
            //     callback(this.RESULT_SUCCESS)
            //   })
            //   .catch((err) => {
            //     console.error('Failed Create Order Firebase', err)
            //     pusher.trigger(process.env.CHANNEL_NAME, constants.EVENT_FAILED_CREATE_ORDER, err)
            //     // callback(this.RESULT_FAILED)
            //   })
        
          }
        })
      ]
    })
  ])
})

bleno.on('accept', function (clientAddress) {

  // FirebaseDB.getRestaurantData(process.env.RESTAURANT_ID)
  //   .then((data) => {
  //     console.log('data Firebase : ', data)
  //     pusher.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_GET_DATA_RESTAURANT, data);
  //   })
  //   .catch((err) => {
  //     console.error('eror Firebase', err)
  //     pusher.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_FAILED_GET_RESTAURANT, err);
  //   })

})