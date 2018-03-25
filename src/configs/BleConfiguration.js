require('dotenv').config();

const PERIPHERAL_ID = `${process.env.PERIPHERAL_ID}`;
const PRIMARY_SERVICE_ID = `${process.env.PRIMARY_SERVICE_ID}`;
const PRIMARY_CHARACTERISTIC_ID = `${process.env.PRIMARY_CHARACTERISTIC_ID}`;
const BASE_UUID = `${process.env.BASE_UUID}`;

const settings = {
  service_id: PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID,
  characteristic_id: PERIPHERAL_ID + PRIMARY_CHARACTERISTIC_ID + BASE_UUID
}

module.exports = settings