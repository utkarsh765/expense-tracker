const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.get('/', auth, async (req, res, next) => {
  try {
    const { type, from, to } = req.query;
    const q = { userId: req.user.id };
    if (type && ['income', 'expense'].includes(type)) q.type = type;
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
    res.json(await Transaction.find(q).sort({ date: -1 }));
  } catch (e) { next(e); }
});

router.get('/summary', auth, async (req, res, next) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id });
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const byCategory = {};
    txs.filter(t => t.type === 'expense').forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    res.json({
      income, expense, balance: income - expense,
      savings: Math.max(0, Math.round(income * 0.6)),
      byCategory,
      recent: txs.sort((a, b) => b.date - a.date).slice(0, 5),
    });
  } catch (e) { next(e); }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const tx = await Transaction.create({ ...req.body, userId: req.user.id });
    res.json(tx);
  } catch (e) { next(e); }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const r = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
