var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    idCustomer: String,
    restaurant: {type : Schema.Types.ObjectId, ref: 'Restaurant'},
    table: {type : Schema.Types.ObjectId, ref: 'Table'},
    menu: {type : Schema.Types.ObjectId, ref: 'Menu'},
    quantity: Number
  },
  {
    timestamps: true,
    collection : 'Orders'
  }
);

module.exports = mongoose.model('Order', OrderSchema);