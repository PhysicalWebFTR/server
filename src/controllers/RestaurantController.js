const Menu = require('../models/MenuModel')
const Table = require('../models/TableModel')
const Restaurant = require('../models/RestaurantModel')
const Order = require('../models/OrderModel')

const CachedController = require('./CachedController')

class RestaurantController {

  static getRestaurantData(restaurantId) {
    return new Promise(function (resolve, reject) {
      CachedController.getRestaurant()
        .then((restaurant) => {
          if (restaurant && restaurant !== undefined) {
            resolve(JSON.parse(restaurant))
            return;
          }
          else {
            Restaurant.findOne({ _id: restaurantId })
              .populate('menu_list')
              .populate('table_list')
              .exec()
              .then((data) => {
                console.log('cobaa', data)
                CachedController.saveRestaurant(JSON.stringify(data))
                  .then((statusSaved) => {
                    resolve(data)
                  })
                  .catch((err) => {
                    throw (err)
                  })
              })
              .catch((err) => {
                throw (err)
              })
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static createOrder(data) {
    console.log('data createOrder', data)

    let arrPromise = []
    data.menuList.forEach((item) => {
      arrPromise.push(
        new Order({
          restaurant: data.idRestaurant,
          table: data.idTable,
          menuId: item._id,
          name: item.name,
          quantity: item.quantity,
          isReady: false
        }).save()
      )
    })
    return Promise.all(arrPromise)
  }

  static getOrder(restaurantId) {
    return Order.find({ 'restaurant': restaurantId })
      .populate('restaurant')
      .populate('table')
      .populate('menu')
      .exec()
  }

}

module.exports = RestaurantController
