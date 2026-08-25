const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
