const chai = require('chai')
const FirebaseDB = require('../firebase/FirebaseController')

const expect = chai.expect;

const idRestaurant = 'UwtUW7ny5SPbbCWE8rWv'

describe('Restaurant Data', function () {

  describe('Success Get Restaurant Data', function () {

    it('Status Code : 200', function (done) {

      FirebaseDB.getRestaurantData(idRestaurant)
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
        })

    });

  })


});
