const db = require('./Firebase')

class Firebase {

  static getRestaurantData(restaurantId) {
    return new Promise(function (resolve, reject) {

      var restaurantRef = db.collection('Restaurants').doc(restaurantId);

      const arrPromise = [
        restaurantRef.get(),
        restaurantRef.collection("menu").get(),
        restaurantRef.collection("tableList").get()
      ]

      Promise.all(arrPromise)
        .then(data => {
          let documentRestaurant = data[0]
          let snapshotMenu = data[1]
          let snapshotTableList = data[2]

          let restaurantName = documentRestaurant.data().name

          let arrMenu = []
          snapshotMenu.forEach(doc => {
            arrMenu.push({
              id: doc.id,
              name: doc.data().name,
              photoUrl: doc.data().photoUrl,
              description: doc.data().description,
              price: doc.data().price,
              category: doc.data().category
            })
          })

          let arrTableList = []
          snapshotTableList.forEach(doc => {
            arrTableList.push({
              id: doc.id,
              name: doc.data().tableName,
              status: doc.data().tableStatus
            })
          })

          const response = {
            id: restaurantId,
            name: restaurantName,
            table_list: arrTableList,
            menu_list: arrMenu
          }

          resolve(response)
        })
        .catch(err => {
          reject(err)
        });
    })
  }

  static createOrder(orderData) {
    return new Promise(function (resolve, reject) {
      const OrderCollection = db.collection('Orders')
      OrderCollection.add({
        idCustomer: orderData.idCustomer,
        idRestaurant: orderData.idRestaurant,
        idTable: orderData.idTable,
      })
        .then((response) => {

          const arrPromiseMenu = []
          orderData.menuList.forEach(data => {
            arrPromiseMenu.push(
              OrderCollection.doc(response.id).collection('menuList')
                .add({
                  menuId: data.menuId,
                  quantity: data.quantity,
                  price: data.price
                })
            )
          })

          return Promise.all(arrPromiseMenu)
        })
        .then((response) => {
          resolve('Success')
        })
        .catch((error) => {
          reject(error)
        });
    })
  }

}

module.exports = Firebase