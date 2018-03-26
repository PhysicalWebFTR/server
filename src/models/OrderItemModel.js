var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderItemSchema = new Schema(
  {
    menuId: String,
    name:String,
    quantity: Number,
    price: Number
  },
  {
    timestamps: true,
    collection : 'OrderItems'
  }
);

module.exports = mongoose.model('OrderItem', OrderItemSchema);