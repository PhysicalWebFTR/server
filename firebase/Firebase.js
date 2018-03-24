var { initializeApp } = require('firebase')

require('firebase/firestore')

const app = initializeApp({
  apiKey: "AIzaSyCmR2FSt71WPkAqYrxan_E0KPEuv_7YwDc",
  authDomain: "momakan-500e4.firebaseapp.com",
  databaseURL: "https://momakan-500e4.firebaseio.com",
  projectId: "momakan-500e4",
  storageBucket: "momakan-500e4.appspot.com",
  messagingSenderId: "427416696192"
})

const db = app.firestore()

module.exports = db
