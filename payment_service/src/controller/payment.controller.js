import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import redisClient from "../config/redis.config.js";
import mongoose from "mongoose";
import { createIdempotentKey } from "../utils/key.js";

export const createAccount = async (req, res) => {
  const { username, amount } = req.body;
  const account = await accountModel.create({
    userName: username,
    balance: amount,
  });
  return res
    .status(201)
    .json({ success: true, message: "Account created", account });
};

export const transactionController = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { fromAccountId, toAccountId, amount, clientRequestId } = req.body;
    // console.log(fromAccountId, toAccountId, amount, clientRequestId)

    if (!clientRequestId) {
      return res
        .status(400)
        .json({ success: false, message: "clientRequestId is required" });
    }
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number" });
    }
    if (fromAccountId === toAccountId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot transfer to the same account",
        });
    }

    // idempotency key now includes a client-supplied unique id, so repeat
    // *legitimate* transfers between the same pair/amount aren't blocked
    const idempotencyKey = await createIdempotentKey({
      fromAccountId,
      toAccountId,
      amount,
      clientRequestId,
    });

    // check first
    const existing = await redisClient.get(idempotencyKey);
    if (existing) {
      const cached = JSON.parse(existing);
      return res.status(cached.statusCode).json(cached.body);
    }

    // atomically claim the key — NX means "only set if not already set",
    // so two concurrent identical requests can't both pass the check above
    const claimed = await redisClient.set(
      idempotencyKey,
      JSON.stringify({ status: "PROCESSING" }),
      "EX",
      60 * 60 * 24,
      "NX",
    );
    if (!claimed) {
      return res
        .status(409)
        .json({ success: false, message: "Request already in progress" });
    }

    try {
      session.startTransaction();

      // atomic: only matches if balance is sufficient, so the check and the
      // deduction happen as one indivisible operation — no window for a
      // concurrent request to read a stale balance
      const fromAccount = await accountModel.findOneAndUpdate(
        { _id: fromAccountId, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session, new: true },
      );

      if (!fromAccount) {
        // findOneAndUpdate returning null is ambiguous — could mean "account
        // doesn't exist" or "balance too low". Disambiguate for a useful error.
        const exists = await accountModel
          .exists({ _id: fromAccountId })
          .session(session);
        throw new Error(
          exists
            ? "Insufficient balance in the sender's account"
            : "Sender account not found",
        );
      }

      const toAccount = await accountModel.findOneAndUpdate(
        { _id: toAccountId },
        { $inc: { balance: amount } },
        { session, new: true },
      );

      if (!toAccount) throw new Error("Receiver account not found");

      const [transaction] = await transactionModel.create(
        [
          {
            fromAccount: fromAccountId,
            toAccount: toAccountId,
            transferedAmount: amount,
            status: "SUCCESS",
            idempotencyKey,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      const responseBody = {
        success: true,
        message: "Transaction successful",
        transaction,
      };
      // store the result, don't delete the key — a retry should get this cached response
      await redisClient.set(
        idempotencyKey,
        JSON.stringify({ statusCode: 200, body: responseBody }),
        "EX",
        60 * 60 * 24,
      );

      return res.status(200).json(responseBody);
    } catch (err) {
      console.error("Payment failed. Initiating rollback...", err.message);
      await session.abortTransaction();
      // release the key on failure so a genuine retry isn't blocked for 24h
      await redisClient.del(idempotencyKey);
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:
        "error while transaction and money will be returned within 3 days",
    });
  }
};

export const getBalance = async(req,res)=>{
  const {accountId} = req.body;
  try{
    const account = await accountModel.findById(accountId);
    if(!account) return res.status(404).json({success:false,message:"account not found"});
    return res.status(200).json({success:true,message:"account detail fetched",account:{
      accounName: account.userName,
      balance: account.balance
    }})
  }catch(err){
    console.log(err);
    return res.status(500).json({success:false,message:"error while fetching balance"})
  }
}
