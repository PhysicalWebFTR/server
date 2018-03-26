var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema(
  {
    name: String,
    photoUrl: String,
    description: String,
    category: String,
    price: Number
  },
  {
    timestamps: true,
    collection : 'Menus'
  }
);

module.exports = mongoose.model('Menu', MenuSchema);