const bleno = require('bleno')
const mongoose = require('mongoose')

//Constants
const constants = require('./src/configs/Constants')
const settings = require('./src/configs/BleConfiguration')
const pusher = require('./src/configs/PusherConfiguration')

//Controllers
const CachedController = require('./src/controllers/CachedController')
const RestaurantController = require('./src/controllers/RestaurantController')


require('dotenv').config();


/**
 * Mongo DB Setup
 */
mongoose.connect(`${process.env.MONGO_URL}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('CONNECT TO MONGOOSE');
})


// RestaurantController.getOrder(process.env.RESTAURANT_ID)
//   .then((data) => {
//     console.log(data)
//   })
//   .catch((err) => {
//     console.error(err)
//   })


// const channel = pusher.js.subscribe('order-channel')
// channel.bind('get-order-event', function (data) {
//   console.log(data);

//   // let obj = JSON.parse(data.toString())
//   RestaurantController.createOrder(obj)
//     .then((result) => {
//       console.log('Success Create Order', result)
//       pusher.main.trigger(process.env.CHANNEL_NAME, constants.EVENT_ORDER, data)
//       callback(this.RESULT_SUCCESS)
//     })
//     .catch((err) => {
//       console.error('Failed Create Order', err)
//       pusher.main.trigger(process.env.CHANNEL_NAME, constants.EVENT_FAILED_CREATE_ORDER, err)
//     })

// });

/**
 * BLE
 */
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
        createOrderCharacteristic
      ]
    })
  ])
})

bleno.on('accept', function (clientAddress) {
  console.log('accept')
  RestaurantController.getRestaurantData(process.env.RESTAURANT_ID)
    .then((data) => {
      pusher.main.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_GET_DATA_RESTAURANT, data)
    })
    .catch((err) => {
      console.error(err)
      pusher.main.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_FAILED_GET_RESTAURANT, err)
    })

})


/**
 * Service Characteristics
 */
const createOrderCharacteristic = new bleno.Characteristic({
  value: null,
  uuid: settings.characteristic_id,
  properties: ['write'],
  onWriteRequest: function (data, offset, withoutResponse, callback) {
    console.log('Write Request..')

    let obj = JSON.parse(data.toString())
    RestaurantController.createOrder(obj)
      .then((result) => {
        console.log('Success Create Order', result)
        pusher.main.trigger(process.env.CHANNEL_NAME, constants.EVENT_ORDER, data)
        callback(this.RESULT_SUCCESS)
      })
      .catch((err) => {
        console.error('Failed Create Order', err)
        pusher.main.trigger(process.env.CHANNEL_NAME, constants.EVENT_FAILED_CREATE_ORDER, err)
      })
  }
})
