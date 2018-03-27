const bleno = require('bleno')
const mongoose = require('mongoose')

//Constants
const constants = require('./src/configs/Constants')
const settings = require('./src/configs/BleConfiguration')
const pusher = require('./src/configs/PusherConfiguration')

//Controllers
const RestaurantController = require('./src/controllers/RestaurantController')
const CachedController = require('./src/controllers/CachedController')


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


// /**
//  * BLE
//  */
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

  CachedController.getRestaurant()
    .then((restaurant) => {

      if (restaurant && restaurant !== undefined) {
        pusher.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_GET_DATA_RESTAURANT, restaurant)
        return
      }

      RestaurantController.getRestaurantData(process.env.RESTAURANT_ID)
        .then((data) => {
          return CachedController.saveRestaurant(data)
            .then((statusSaved) => {
              pusher.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_GET_DATA_RESTAURANT, data)
            })
            .catch((err) => {
              console.error('failed save restaurant', error)
              throw (err)
            })
        })
        .catch((err) => {
          console.error('failed get restaurant data', error)
          throw (err)
        })
    })
    .catch((error) => {
      console.error('failed send data restaurant', error)
      pusher.trigger(`${process.env.CHANNEL_NAME}`, constants.EVENT_FAILED_GET_RESTAURANT, error)
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
    console.log('obj', obj)

    RestaurantController.createOrder(obj)
      .then((result) => {
        console.log('Success Create Order', result)
        pusher.trigger(process.env.CHANNEL_NAME, constants.EVENT_ORDER, data)

        ///////////////////////////////////////////////////////////////////

        result.forEach((item) => {
          console.log('item', item)
          RestaurantController.getOrder(item._id)
            .then((detailOrder) => {
              let newDetail = {
                table: detailOrder.tableId,
                menuList: detailOrder.menuId,
                quantity: detailOrder.quantity,
                isReady: detailOrder.isReady
              }
              console.log('newDetail', newDetail)
              pusher.trigger(process.env.CHANNEL_NAME, constants.EVENT_ORDER_ADMIN, newDetail)

            })
            .catch((err) => {
              console.error('failed get order', err)
            })
        })

        // callback(this.RESULT_SUCCESS)
      })
      .catch((err) => {
        console.error('Failed Create Order', err)
        pusher.trigger(process.env.CHANNEL_NAME, constants.EVENT_FAILED_CREATE_ORDER, err)
      })
  }
})