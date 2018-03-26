const chai = require('chai')
const mongoose = require('mongoose')

const expect = chai.expect;


require('dotenv').config();

/**
 * Mongo DB Setup
 */
mongoose.connect(`${process.env.MONGO_URL_TEST}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('CONNECT TO MONGOOSE');
})


const RestaurantController = require('../src/controllers/RestaurantController')
// const CachedController = require('../src/controllers/CachedController')


const idRestaurant = '5ab7bce6f36d28275093857e'
const exampleData = {
  restaurant: '5ab7bce6f36d28275093857e',
  table: '5ab7bd43f36d2827509385a6',
  menuList: [{
    menuId: '5ab7bfddf36d282750938637',
    name: 'Christmas Pie',
    quantity: 2
  }]
}

describe('Request Data', function () {

  describe('Restaurant Data', function () {
    it('Success Get Restaurant Data', function (done) {
      RestaurantController.getRestaurantData(idRestaurant)
        .then((data) => {
          console.log(data)
          expect(data).to.be.a('object');

          expect(data).to.have.property('_id');
          expect(data).to.have.property('name');
          expect(data).to.have.property('table_list');
          expect(data).to.have.property('menu_list');

          expect(data._id).to.be.a('string');
          expect(data.name).to.be.a('string');
          expect(data.table_list).to.be.a('array');
          expect(data.menu_list).to.be.a('array');

          done()
        })
        .catch((err) => {
          console.error('eror Firebase', err)
        })
    }).timeout(0)

  })

  // describe('Create Restaurant Order', function () {
  //   RestaurantController.createOrder(exampleData)
  //     .then((data) => {
  //       console.log('create : ', data)
  //       expect(data).to.be.a('array');

  //       // expect(data).to.have.property('id');
  //       // expect(data).to.have.property('name');
  //       // expect(data).to.have.property('table_list');
  //       // expect(data).to.have.property('menu_list');

  //       // expect(data.id).to.be.a('string');
  //       // expect(data.name).to.be.a('string');
  //       // expect(data.table_list).to.be.a('array');
  //       // expect(data.menu_list).to.be.a('array');

  //       done()
  //     })
  //     .catch((err) => console.error('error', err))
  // })

  // describe('Get Restaurant Orders', function () {

  // })

});
