const Menu = require('../models/MenuModel')
const Table = require('../models/TableModel')
const Restaurant = require('../models/RestaurantModel')
const Order = require('../models/OrderModel')

const CachedController = require('./CachedController')

class RestaurantController {

  static getRestaurantData(restaurantId) {
    if(!restaurantId) return Promise.reject({ message: 'Bad Request' })
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

    if(validBody){
      data.menuList.forEach((item) => {
        const orderData = {
          // restaurant: data.idRestaurant,
          table: data.idTable,
          menuId: item._id,
          name: item.name,
          quantity: item.quantity,
          isReady: false
        }
  
        if (orderData.menuId && orderData.name && orderData.quantity) {
          arrPromise.push( new Order(orderData).save() )
        }
        else return validBody = false
        
      })
    }

    validHeader = data.idTable != null
    validRequest = validHeader && validBody

    if (validRequest) return Promise.all(arrPromise)
    else return Promise.reject({ message: 'Bad Request' })
  }

  static getOrders(restaurantId) {
    if(!restaurantId) return Promise.reject({ message: 'Bad Request' })
    // return Order.find({ 'restaurant': restaurantId })
    return Order.find()
      .populate('restaurant')
      .populate('table')
      .populate('menu')
      .exec()
  }

}

module.exports = RestaurantController
