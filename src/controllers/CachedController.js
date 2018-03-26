const redis = require("redis");
const client = redis.createClient();

const RedisKeys = require("../configs/RedisKeys")


class CachedController {

  static saveRestaurant(restaurantData){
    return new Promise(function (resolve, reject) {
      client.set(RedisKeys.RESTAURANT, restaurantData, function (err, reply) {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }

  static getRestaurant() {
    return new Promise(function (resolve, reject) {
      client.get(RedisKeys.RESTAURANT, function (err, reply) {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }

}

module.exports = CachedController