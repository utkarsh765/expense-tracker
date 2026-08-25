const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Savings = require('../models/Savings');

router.get('/', auth, async (req, res, next) => {
  try { res.json(await User.findById(req.user.id).select('-password')); }
  catch (e) { next(e); }
});

router.put('/', auth, async (req, res, next) => {
  try {
    const { name, dob, gender, currency, timezone, theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, dob, gender, currency, timezone, theme } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (e) { next(e); }
});

router.get('/export', auth, async (req, res, next) => {
  try {
    const [user, transactions, budgets, savings] = await Promise.all([
      User.findById(req.user.id).select('-password'),
      Transaction.find({ userId: req.user.id }),
      Budget.find({ userId: req.user.id }),
      Savings.find({ userId: req.user.id }),
    ]);
    res.json({ user, transactions, budgets, savings });
  } catch (e) { next(e); }
});

router.delete('/reset', auth, async (req, res, next) => {
  try {
    await Promise.all([
      Transaction.deleteMany({ userId: req.user.id }),
      Budget.deleteMany({ userId: req.user.id }),
      Savings.deleteMany({ userId: req.user.id }),
    ]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
