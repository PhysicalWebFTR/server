const redis = require("redis");
const client = redis.createClient();

const RedisKeys = require("../configs/RedisKeys")


class CachedController {

  static saveRestaurant(restaurantData){
    if(!restaurantData) return Promise.reject({message: 'Bad Request'})
    return new Promise(function (resolve, reject) {
      const data = JSON.stringify(restaurantData)
      client.set(RedisKeys.RESTAURANT, data, function (err, reply) {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }

  static getRestaurant() {
    return new Promise(function (resolve, reject) {
      client.get(RedisKeys.RESTAURANT, function (err, reply) {
        if (err) reject(err)
        else resolve(JSON.parse(reply))
      })
    })
  }

}

module.exports = CachedController