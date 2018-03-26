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
          if (restaurant !== null && restaurant !== undefined && restaurant !== "undefined") {
            resolve(restaurant)
            return;
          }
          else {
            Restaurant.findOne({ _id: restaurantId })
            .populate('menu_list')
            .populate('table_list')
            .exec()
            .then((data) => {
              CachedController.saveRestaurant(JSON.stringify(data))
                .then((statusSaved) => {
                  resolve(data)
                })
                .catch((err) => {
                  throw (err)
                })
            })
          }
        })
        .catch((error) => {
          console.log('xx2')
          reject(error)
        })
    })
  }

  static createOrder(data) {
    var order = new Order(
      {
        idCustomer: data.idCustomer,
        restaurant: data.restaurant,
        table: data.table,
        menu: data.menuId,
        quantity: data.quantity
      }
    )

    return new Promise(function (resolve, reject) {
      order.save(function (err, savedData) {
        if (err) reject(err);
        else resolve(savedData);
      });
    })
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