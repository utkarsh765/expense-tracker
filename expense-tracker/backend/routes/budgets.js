const router = require('express').Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

router.get('/', auth, async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ deadline: 1 });
    const txs = await Transaction.find({ userId: req.user.id, type: 'expense' });
    const enriched = budgets.map(b => {
      const spent = txs
        .filter(t => t.category === b.category && new Date(t.date) <= new Date(b.deadline))
        .reduce((s, t) => s + t.amount, 0);
      const remaining = Math.max(0, b.amount - spent);
      const percent = b.amount ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
      const status = new Date(b.deadline) < new Date() || spent >= b.amount ? 'completed' : 'active';
      return { ...b.toObject(), spent, remaining, percent, status };
    });
    res.json(enriched);
  } catch (e) { next(e); }
});

router.post('/', auth, async (req, res, next) => {
  try { res.json(await Budget.create({ ...req.body, userId: req.user.id })); }
  catch (e) { next(e); }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const b = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, req.body, { new: true }
    );
    if (!b) return res.status(404).json({ message: 'Not found' });
    res.json(b);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const r = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
