const Menu = require('../models/MenuModel')
const Table = require('../models/TableModel')
const Restaurant = require('../models/RestaurantModel')
const Order = require('../models/OrderModel')

const CachedController = require('./CachedController')

class RestaurantController {

  static getRestaurantData(restaurantId) {
    if (!restaurantId) return Promise.reject({ message: 'Bad Request' })
    return Restaurant.findOne({ _id: restaurantId })
      .populate('menu_list')
      .populate('table_list')
      .exec()
  }

  static createOrder(data) {
    let arrPromise = []

    let validHeader = true
    let validBody = data.menuList && data.menuList.length > 0
    let validRequest = false

    if (validBody) {
      console.log('controller', data)
      data.menuList.forEach((item) => {

        const orderData = {
          // restaurant: data.idRestaurant,
          table: data.idTable,
          menuId: item._id,
          quantity: item.quantity,
          isReady: false
        }

        if (orderData.menuId && orderData.quantity) {
          arrPromise.push(new Order(orderData).save())
        }
        else return validBody = false

      })
    }

    validHeader = data.idTable != null
    validRequest = validHeader && validBody

    if (validRequest) return Promise.all(arrPromise)
    else return Promise.reject({ message: 'Bad Request' })
  }

  static getOrder(orderId){
    return Order.findOne({ '_id': orderId })
      .populate('tableId')
      .populate('menuId')
      .exec()
  }

  static getOrders(restaurantId) {
    if (!restaurantId) return Promise.reject({ message: 'Bad Request' })
    return Order.find({ 'restaurant': restaurantId })
    // return Order.find()
      // .populate('restaurant')
      .populate('tableId')
      .populate('menuId')
      .exec()
  }

  static getSummaryOrderFood(restaurantId) {
    if (!restaurantId) return Promise.reject({ message: 'Bad Request' })
    return new Promise(function (resolve, reject) {
      RestaurantController.getOrders(restaurantId)
        .then((data) => {

          let result = {}
          data.forEach((order) => {
            if (result[order.menuId._id]) {
              result[order.menuId._id] = {
                name: order.menuId.name,
                quantity: order.quantity + result[order.menuId._id].quantity
              }
            }
            else {
              result[order.menuId._id] = {
                name: order.menuId.name,
                quantity: order.quantity
              }
            }
          })

          let finalResult = []
          Object.keys(result).forEach((key) => {
            finalResult.push({ name: result[key].name, quantity: result[key].quantity })
          })

          resolve(finalResult)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }


  static getSummaryOrderCategory(restaurantId) {
    if (!restaurantId) return Promise.reject({ message: 'Bad Request' })
    return new Promise(function (resolve, reject) {
      RestaurantController.getOrders(restaurantId)
        .then((data) => {
          let result = {}
          data.forEach((order) => {
            if (result[order.menuId.category]) {
              result[order.menuId.category] = {
                category: order.menuId.category,
                quantity: order.quantity + result[order.menuId.category].quantity
              }
            }
            else {
              result[order.menuId.category] = {
                category: order.menuId.category,
                quantity: order.quantity
              }
            }
          })

          let finalResult = []
          Object.keys(result).forEach((key) => {
            finalResult.push({ name: result[key].category, quantity: result[key].quantity })
          })

          resolve(finalResult)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = RestaurantController
