import { Router } from "express";
import { createAccount ,getBalance,transactionController} from "../controller/payment.controller.js";

const router = Router();

router.get('/',(req,res)=>{
 res.send("payment service health check")
})

router.post('/create-account',createAccount);

router.post('/transaction',transactionController);

router.get('/balance',getBalance);

export default router;