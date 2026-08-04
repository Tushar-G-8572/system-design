import express from 'express';
import { bookSeat,bookSeatAutomic ,holdSeat,confirmSeat,cancelSeat} from './controller/bookingController.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the Booking API');
});

app.post("/seats/:seatId/book-naive", bookSeat);
app.post("/seats/:seatId/book-atomic", bookSeatAutomic);

app.post("/seats/:seatId/hold", holdSeat);
app.post("/seats/:seatId/confirm", confirmSeat);
app.post("/seats/:seatId/cancel", cancelSeat);

export default app