import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { fmtINR, fmtDate } from '../utils/format';

const empty = { title: '', amount: '', category: '', deadline: new Date().toISOString().slice(0,10) };

export default function Budget() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/budgets').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) return toast.error('All fields required');
    await api.post('/budgets', { ...form, amount: Number(form.amount) });
    toast.success('Budget created'); setOpen(false); setForm(empty); load();
  };
  const remove = async (id) => { await api.delete(`/budgets/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <button onClick={()=>setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">+ New Budget</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(b => (
          <div key={b._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-xs text-slate-500">{b.category} · due {fmtDate(b.deadline)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${b.status==='active'?'bg-green-100 text-green-700':'bg-slate-200 text-slate-700'}`}>{b.status}</span>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between"><span>Spent</span><span>{fmtINR(b.spent)} / {fmtINR(b.amount)}</span></div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded mt-1">
                <div className="h-2 bg-indigo-600 rounded" style={{ width: `${b.percent}%` }} />
              </div>
              <div className="mt-2 text-slate-500">Remaining: {fmtINR(b.remaining)}</div>
            </div>
            <button onClick={()=>remove(b._id)} className="mt-3 text-red-600 text-sm">Delete</button>
          </div>
        ))}
        {!items.length && <p className="text-slate-500">No budgets yet.</p>}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-3">
            <h3 className="text-lg font-bold">New Budget</h3>
            <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <input type="number" className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Total amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
            <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Category (matches transaction category)" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
            <input type="date" className="w-full px-3 py-2 rounded border dark:bg-slate-700" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded">Cancel</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
