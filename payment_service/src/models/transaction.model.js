import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  transferedAmount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be positive"]
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "ROLLED_BACK"],
    default: "PENDING"
  },
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

const transactionModel = mongoose.model('transaction', transactionSchema);
export default transactionModel;