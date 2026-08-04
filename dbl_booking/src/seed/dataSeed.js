import mongoose from 'mongoose';
import Seat from '../models/seat.model.js';
import Trip from '../models/trip.model.js';

export const seedData = async () => {
 const MONGO_URI="mongodb://127.0.0.1:27017/dbl_booking"
 await mongoose.connect(MONGO_URI);
  try {
   const trip = await Trip.create({ userId: 'user123', totalSeats: 10 });
   const seats = Array.from({ length: 10 }, (_, i) => ({
     tripId: trip._id,
     seatNumber: `A${i + 1}`,
   }));
   await Seat.insertMany(seats);
   console.log('Data seeded successfully');
   process.exit(0);
  }
  catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
 }

 seedData();