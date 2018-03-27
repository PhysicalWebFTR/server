const chai = require('chai')
const mongoose = require('mongoose')


const expect = chai.expect

require('dotenv').config()

/**
 * Mongo DB Setup
 */
mongoose.connect(`${process.env.MONGO_URL_TEST}`)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // console.log('CONNECT TO MONGOOSE')
})

/**
 * Controllers
 */
const RestaurantController = require('../src/controllers/RestaurantController')
const CachedController = require('../src/controllers/CachedController')

/**
 * Example Data
 */
const DummyData = require('./DummyData')
var exampleRestaurant = {}


describe('Data', function () {

  describe('Restaurant Data', function () {

    it('Get Restaurant Data Success', function (done) {

      RestaurantController.getRestaurantData(DummyData.idRestaurant)
        .then((data) => {
          // console.log(data)
          expect(data).to.be.a('object')

          expect(data).to.have.property('_id')
          expect(data).to.have.property('name')
          expect(data).to.have.property('table_list')
          expect(data).to.have.property('menu_list')

          expect(data._id).to.be.a('object')
          expect(data.name).to.be.a('string')
          expect(data.table_list).to.be.an('array')
          expect(data.menu_list).to.be.an('array')

          exampleRestaurant = data
          done()
        })
        .catch((err) => {
          console.error('eror get restauran data', err)
        })

    }).timeout(0)

    it('Get Restaurant Data Bad Request', function (done) {

      RestaurantController.getRestaurantData()
        .catch((err) => {
          expect(err).to.have.property('message')
          expect(err.message).to.equal('Bad Request')

          done()
        })

    }).timeout(0)

  })

  describe('Order Data', function () {

    describe('Create Order Data', function () {
      it('Create Restaurant Order Success', function (done) {

        RestaurantController.createOrder(DummyData.exampleOrder)
          .then((data) => {
            // console.log('create Create Restaurant: ', data)
            expect(data).to.be.a('array')
            expect(data).to.have.lengthOf(1);

            data.forEach((item) => {
              expect(data[0]).to.have.property('_id')
              expect(data[0]).to.have.property('menuId')
              expect(data[0]).to.have.property('quantity')
              expect(data[0]).to.have.property('isReady')

              expect(data[0]._id).to.be.a('object')
              expect(data[0].menuId).to.be.a('object')
              expect(data[0].quantity).to.be.a('number')
              expect(data[0].isReady).to.be.false
            })

            done()
          })
          .catch((err) => console.error('error Create Restaurant', err))

      }).timeout(0)


      it('Create Restaurant Order Bad Request (without menu)', function (done) {
        RestaurantController.createOrder(DummyData.failedOrderMenu)
          .catch((err) => {
            // console.error('Bad Request Create Restaurant Order', err)
            expect(err).to.have.property('message')
            expect(err.message).to.equal('Bad Request')

            done()
          })
      }).timeout(0)

      it('Create Restaurant Order Bad Request (without table)', function (done) {
        RestaurantController.createOrder(DummyData.failedOrderTable)
          .catch((err) => {
            // console.error('Bad Request Create Restaurant Order', err)
            expect(err).to.have.property('message')
            expect(err.message).to.equal('Bad Request')

            done()
          })
      }).timeout(0)

      it('Create Restaurant Order Bad Request (without menu id)', function (done) {
        RestaurantController.createOrder(DummyData.failedOrderMenuId)
          .catch((err) => {
            // console.error('Bad Request Create Restaurant Order', err)
            expect(err).to.have.property('message')
            expect(err.message).to.equal('Bad Request')

            done()
          })
      }).timeout(0)

      it('Create Restaurant Order Bad Request (without menu quantity)', function (done) {
        RestaurantController.createOrder(DummyData.failedOrderMenuQty)
          .catch((err) => {
            // console.error('Bad Request Create Restaurant Order', err)
            expect(err).to.have.property('message')
            expect(err.message).to.equal('Bad Request')

            done()
          })
      }).timeout(0)

    })

    describe('Get Restaurant Orders', function () {

      it('Get Restaurant Orders Success', function (done) {

        RestaurantController.getOrders(DummyData.idRestaurant)
          .then((data) => {
            // console.log('Get Restaurant Orders', data)
            expect(data).to.be.a('array')

            data.forEach((item) => {
              expect(item).to.have.property('_id')
              expect(item).to.have.property('menuId')
              expect(item).to.have.property('quantity')
              expect(item).to.have.property('isReady')

              expect(item._id).to.be.a('object')
              expect(item.menuId).to.be.a('object')
              expect(item.quantity).to.be.a('number')
              expect(item.isReady).to.be.false
            })

            done()
          })
          .catch((err) => {
            console.error('Get Restaurant Orders', err)
          })

      }).timeout(0)

      it('Get Restaurant Orders Bad Request (without restaurant id)', function (done) {
        RestaurantController.getOrders()
          .catch((err) => {
            // console.error('error', err)
            expect(err).to.have.property('message')
            expect(err.message).to.equal('Bad Request')

            done()
          })
      }).timeout(0)

    })

  })

})


describe('Cached', function () {

  describe('Create Restaurant Cached', function () {

    it('Create cached Success', function (done) {
      CachedController.saveRestaurant(exampleRestaurant)
        .then((data) => {
          expect(data).to.be.a('string')
          expect(data).to.equal('OK')

          done()
        })
        .catch((err) => console.error('Create cached Success (error)', err))
    }).timeout(0)

    it('Create cached Bad Request', function (done) {
      CachedController.saveRestaurant()
        .catch((err) => {
          // console.error('error', err)
          expect(err).to.have.property('message')
          expect(err.message).to.equal('Bad Request')

          done()
        })
    }).timeout(0)

  })

  describe('Get Restaurant Cached', function () {

    it('Get cached Success', function (done) {

      CachedController.getRestaurant()
        .then((data) => {
          expect(data).to.be.a('object')
          expect(JSON.stringify(data)).to.equal(JSON.stringify(exampleRestaurant))
          done()
        })
        .catch((err) => console.error('Get cached Success (error)', err))

    }).timeout(0)

  })


  describe('Close Cached Connection', function () {

    it('Create Restaurant Cached Failed', function (done) {
      CachedController.getClient().quit()
      CachedController.saveRestaurant(exampleRestaurant)
      .catch((err) => {
        // console.error('error', err)
        expect(err).to.have.property('code')

        done()
      })

    }).timeout(0)

    it('Get Restaurant Cached Failed', function (done) {
      CachedController.getClient().quit()
      CachedController.getRestaurant()
      .catch((err) => {
        // console.error('error', err)
        expect(err).to.have.property('code')

        done()
      })

    }).timeout(0)

  })


})
