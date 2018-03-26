var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestaurantSchema = new Schema(
  {
    name: String,
    table_list: [{type : Schema.Types.ObjectId, ref: 'Table'}],
    menu_list: [{type : Schema.Types.ObjectId, ref: 'Menu'}]
  },
  {
    timestamps: true,
    collection : 'Restaurants'
  }
);

module.exports =  mongoose.model('Restaurant', RestaurantSchema);