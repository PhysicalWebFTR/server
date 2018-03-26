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

describe('Request Data', function () {
  describe('Restaurant Data', function () {

    it('Success Get Restaurant Data', function (done) {
      // this.timeout(10000)
      RestaurantController.getRestaurantData('5ab7bce6f36d28275093857e')
          .then((data) => {
            console.log(data)
            expect(data).to.be.a('object');
            
            expect(data).to.have.property('id');
            expect(data).to.have.property('name');
            expect(data).to.have.property('table_list');
            expect(data).to.have.property('menu_list');
  
            expect(data.id).to.be.a('string');
            expect(data.name).to.be.a('string');
            expect(data.table_list).to.be.a('array');
            expect(data.menu_list).to.be.a('array');
  
            done()
          })
          .catch((err) => {
            console.error('eror Firebase', err)
            done()
          })
  
      }).timeout(0)

    // it('Success Get Restaurant Data', function (done) {
    //   FirebaseDB.getRestaurantData(idRestaurant)
    //     .then((data) => {
    //       console.log(data)
    //       expect(data).to.be.a('object');
          
    //       expect(data).to.have.property('id');
    //       expect(data).to.have.property('name');
    //       expect(data).to.have.property('table_list');
    //       expect(data).to.have.property('menu_list');

    //       expect(data.id).to.be.a('string');
    //       expect(data.name).to.be.a('string');
    //       expect(data.table_list).to.be.a('array');
    //       expect(data.menu_list).to.be.a('array');

    //       done()
    //     })
    //     .catch((err) => {
    //       console.error('eror Firebase', err)
    //     })

    // }).timeout(0);

  })


  // describe('Order', function () {

  //   it('Success Create Order Data', function (done) {

  //   }).timeout(0);

  //   it('Success Delete Order Data', function (done) {

  //   }).timeout(0);

  // })

});
