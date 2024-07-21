import express from 'express'
import { getBookingId, newBooking,deleteBooking } from '../controllers/booking-controller.js';

const bookingRouter = express.Router();
bookingRouter.post('/',newBooking)
bookingRouter.get('/:id',getBookingId).delete('/:id',deleteBooking);

export default bookingRouter;