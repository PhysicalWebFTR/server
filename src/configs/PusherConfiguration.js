const Pusher = require('pusher'); // for pushing real-time updates to clients

require('dotenv').config();

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  encrypted: true
})

module.exports = pusher