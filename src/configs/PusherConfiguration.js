const Pusher = require('pusher'); // for pushing real-time updates to clients
// const PusherJS = require('pusher-js'); // for listening real-time updates from clients

require('dotenv').config();

const obj = {
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  encrypted: true
}

const main = new Pusher(obj)
// const js = new PusherJS(obj)

module.exports = {
  main,
  // js
}