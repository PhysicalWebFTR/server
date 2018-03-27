/**
 * Customer
 */
const EVENT_GET_DATA_RESTAURANT = "get-restaurant-event";
const EVENT_FAILED_GET_RESTAURANT = "restaurant-data-failed";

const EVENT_ORDER = "order-event";
const EVENT_FAILED_CREATE_ORDER = "event-order-failed";

const EVENT_IMAGE = "image-event";
const EVENT_FAILED_IMAGE = "event-image-failed";



/**
 * Admin
 */
const EVENT_ORDER_ADMIN = "get-order-data";


module.exports = {
  EVENT_GET_DATA_RESTAURANT,
  EVENT_FAILED_GET_RESTAURANT,
  
  EVENT_ORDER,
  EVENT_FAILED_CREATE_ORDER,

  EVENT_IMAGE,
  EVENT_FAILED_IMAGE,

  EVENT_ORDER_ADMIN
}
