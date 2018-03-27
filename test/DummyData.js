const idRestaurant = '5ab7bce6f36d28275093857e'
const exampleOrder = {
  idTable: '5ab7bd43f36d2827509385a6',
  menuList: [{
    _id: '5ab7bfddf36d282750938637',
    name: 'Christmas Pie',
    quantity: 2
  }]
}

const failedOrderMenu = {
  table: '5ab7bd43f36d2827509385a6'
}
const failedOrderTable = {
  menuList: [{
    _id: '5ab7bfddf36d282750938637',
    name: 'Christmas Pie',
    quantity: 2
  }]
}
const failedOrderMenuId = {
  table: '5ab7bd43f36d2827509385a6',
  menuList: [{
    name: 'Christmas Pie',
    quantity: 2
  }]
}
const failedOrderMenuQty = {
  idTable: '5ab7bd43f36d2827509385a6',
  menuList: [{
    _id: '5ab7bfddf36d282750938637',
    name: 'Christmas Pie',
  }]
}

module.exports = {
  idRestaurant,
  exampleOrder,
  failedOrderMenu,
  failedOrderTable,
  failedOrderMenuId,
  failedOrderMenuQty
}