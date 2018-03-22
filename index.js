var bleno = require('bleno'); // for implementing BLE peripheral
var Pusher = require('pusher'); // for pushing real-time updates to clients
var dateFormat = require('dateformat'); // for formatting dates

require('dotenv').config(); // for loading .env file

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
 'message': 'hello world'
});

var time_format = 'h:MM TT';
var customers = [
    {
        id: 1, 
        full_name: 'milfa', 
        time_entered: dateFormat(new Date(1505901033110), time_format)
    },
    {
        id: 2, 
        full_name: 'red', 
        time_entered: dateFormat(new Date(1505901733110), time_format)
    },
    {
        id: 3, 
        full_name: 'silver', 
        time_entered: dateFormat(new Date(1505908733110), time_format)
    }
];

const BASE_UUID = '-5659-402b-aeb3-d2f7dcd1b999';
const PERIPHERAL_ID = '0000';
const PRIMARY_SERVICE_ID = '0100';

var primary_service_uuid = PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID;
var ps_characteristic_uuid = PERIPHERAL_ID + '0300' + BASE_UUID; 

var settings = {
  service_id: primary_service_uuid,
  characteristic_id: ps_characteristic_uuid
};

bleno.on('stateChange', function(state){
  console.log(state)
  if(state === 'poweredOn'){
    console.log('msk true')
    bleno.startAdvertising('FUADI', [settings.service_id], (err) => console.log(err));
  }else{
    console.log('msk false');
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error){
  if(error){
    console.log('something went wrong while trying to start advertisement of services');
  }else{
    console.log('started..');
    bleno.setServices([
      new bleno.PrimaryService({ // create a service
        uuid : settings.service_id,
        characteristics : [
          new bleno.Characteristic({ // add a characteristic to the service
            value : null,
            uuid : settings.characteristic_id,
            properties : ['write'],
            onWriteRequest : function(data, offset, withoutResponse, callback){
              console.log(data, 'buffer kkenya')
              var customer = JSON.parse(data.toString());
              customer.time_entered = dateFormat(new Date(), time_format); 
              customers.push(customer); 
              console.log(customers);

              pusher.trigger('attendance-channel', 'attendance-event', customer); // send the new customer's data to all clients

              callback(this.RESULT_SUCCESS); // tell the client that the request has succeeded
            }
          })
        ]
      })
    ]);
  }
});

bleno.on('accept', function(clientAddress){
  console.log('client address: ', clientAddress);
  var data = {
    is_customers: true,
    customers: customers
  };
  pusher.trigger('attendance-channel', 'attendance-event', data);
});