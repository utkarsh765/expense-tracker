import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { fmtINR, fmtDate } from '../utils/format';

const empty = { name: '', type: 'deposit', amount: '', notes: '', date: new Date().toISOString().slice(0,10) };

export default function Savings() {
  const [data, setData] = useState({ items: [], total: 0, monthly: 0 });
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    const q = filter === 'all' ? '' : `?type=${filter}`;
    api.get(`/savings${q}`).then(r => setData(r.data));
  };
  useEffect(load, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return toast.error('Name and amount required');
    await api.post('/savings', { ...form, amount: Number(form.amount) });
    toast.success('Saved'); setOpen(false); setForm(empty); load();
  };
  const remove = async (id) => { await api.delete(`/savings/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Savings</h2>
        <button onClick={()=>setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">+ Add Entry</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-sm text-slate-500">Total Savings</div>
          <div className="text-2xl font-bold">{fmtINR(data.total)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-sm text-slate-500">This Month</div>
          <div className="text-2xl font-bold">{fmtINR(data.monthly)}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {['all','deposit','withdraw'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-3 py-1 rounded-lg ${filter===f?'bg-indigo-600 text-white':'bg-white dark:bg-slate-800'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b dark:border-slate-700">
            <tr><th className="p-3">Date</th><th>Name</th><th>Type</th><th>Amount</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {data.items.map(s => (
              <tr key={s._id} className="border-b dark:border-slate-700">
                <td className="p-3">{fmtDate(s.date)}</td>
                <td>{s.name}</td>
                <td><span className={s.type==='deposit'?'text-green-600':'text-red-600'}>{s.type}</span></td>
                <td>{fmtINR(s.amount)}</td>
                <td>{s.notes}</td>
                <td className="text-right pr-3"><button onClick={()=>remove(s._id)} className="text-red-600">Del</button></td>
              </tr>
            ))}
            {!data.items.length && <tr><td colSpan="6" className="p-6 text-center text-slate-500">No entries</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-3">
            <h3 className="text-lg font-bold">Add Savings Entry</h3>
            <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <select className="w-full px-3 py-2 rounded border dark:bg-slate-700" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="deposit">Deposit</option><option value="withdraw">Withdraw</option>
            </select>
            <input type="number" className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
            <input type="date" className="w-full px-3 py-2 rounded border dark:bg-slate-700" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            <textarea className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
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
