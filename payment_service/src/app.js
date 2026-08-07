import express from 'express'
import paymentRouter from './router/payment.route.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api',paymentRouter);

export default app;