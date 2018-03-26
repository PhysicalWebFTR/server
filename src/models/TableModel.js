var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableSchema = new Schema(
  {
    name: String,
    status: String
  },
  {
    timestamps: true,
    collection : 'Tables'
  }
);

module.exports = mongoose.model('Table', TableSchema);