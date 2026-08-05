import express from 'express'
import morgan from 'morgan'
import bookingRouter from './router/booking.route.js'

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
 res.send("Hello from tatkal booking");
})

app.use('/api',bookingRouter);



export default app;