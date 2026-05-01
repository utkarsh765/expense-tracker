const router = require('express').Router();
const auth = require('../middleware/auth');
const Savings = require('../models/Savings');

router.get('/', auth, async (req, res, next) => {
  try {
    const { type } = req.query;
    const q = { userId: req.user.id };
    if (type && ['deposit', 'withdraw'].includes(type)) q.type = type;
    const items = await Savings.find(q).sort({ date: -1 });
    const total = items.reduce((s, i) => s + (i.type === 'deposit' ? i.amount : -i.amount), 0);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const monthly = items
      .filter(i => new Date(i.date) >= monthStart)
      .reduce((s, i) => s + (i.type === 'deposit' ? i.amount : -i.amount), 0);
    res.json({ items, total, monthly });
  } catch (e) { next(e); }
});

router.post('/', auth, async (req, res, next) => {
  try { res.json(await Savings.create({ ...req.body, userId: req.user.id })); }
  catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const r = await Savings.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
