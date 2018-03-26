var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    // idCustomer: String,
    restaurant: {type : Schema.Types.ObjectId, ref: 'Restaurant'},
    tableId: {type : Schema.Types.ObjectId, ref: 'Table'},
    menuId: {type : Schema.Types.ObjectId, ref: 'Menu'},
    quantity: Number,
    isReady: Boolean
  },
  {
    timestamps: true,
    collection : 'Orders'
  }
);

module.exports = mongoose.model('Order', OrderSchema);
