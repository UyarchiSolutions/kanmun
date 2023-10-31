const express = require('express');
const SlotBookingController = require('../../controllers/SlotBooking.controller');
const router = express.Router();
const { SellerAuth } = require('../../controllers/sellerAuth.controller');

router.route('/').post(SellerAuth, SlotBookingController.createSlotBooking);
router.route('/slots/:id').get(SellerAuth, SlotBookingController.getBooked_Slot);
router.route('/Booked/slots/Byusers/:id').get(SellerAuth, SlotBookingController.getBooked_Slot_By_Exhibitor);
module.exports = router;
