const redis = require("redis");
const client = redis.createClient();

class CachedController {

  static getImage(key) {
    return new Promise(function (resolve, reject) {
      client.get(key, function (err, reply) {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }

  static saveImages(base64Images) {
    return new Promise(function (resolve, reject) {
      client.set(base64Images.key, base64Images.value, function (err, reply) {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }

}

module.exports = CachedController