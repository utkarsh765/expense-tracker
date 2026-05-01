import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => { api.get('/profile').then(r => setProfile(r.data)); }, []);

  const save = async () => {
    const { data } = await api.put('/profile', { ...profile, theme });
    setProfile(data); toast.success('Saved');
  };

  const exportData = async () => {
    const { data } = await api.get('/profile/export');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'expense-tracker-export.json'; a.click();
  };

  const reset = async () => {
    if (!confirm('Delete ALL your transactions, budgets, and savings?')) return;
    await api.delete('/profile/reset'); toast.success('Data reset');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="font-semibold">Profile</h3>
        <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Name"
          value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Email" disabled value={profile.email} />
        <input type="date" className="w-full px-3 py-2 rounded border dark:bg-slate-700"
          value={profile.dob ? profile.dob.slice(0,10) : ''} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
        <select className="w-full px-3 py-2 rounded border dark:bg-slate-700"
          value={profile.gender || ''} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
          <option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
        </select>
      </section>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="font-semibold">Personalization</h3>
        <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Currency"
          value={profile.currency || 'INR'} onChange={e => setProfile({ ...profile, currency: e.target.value })} />
        <input className="w-full px-3 py-2 rounded border dark:bg-slate-700" placeholder="Timezone"
          value={profile.timezone || 'Asia/Kolkata'} onChange={e => setProfile({ ...profile, timezone: e.target.value })} />
      </section>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="font-semibold">Appearance</h3>
        <div className="flex gap-2">
          <button onClick={()=>setTheme('light')} className={`px-4 py-2 rounded ${theme==='light'?'bg-indigo-600 text-white':'border'}`}>Light</button>
          <button onClick={()=>setTheme('dark')} className={`px-4 py-2 rounded ${theme==='dark'?'bg-indigo-600 text-white':'border'}`}>Dark</button>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <button onClick={save} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Save</button>
        <button onClick={exportData} className="bg-slate-700 text-white px-4 py-2 rounded-lg">Export JSON</button>
        <button onClick={reset} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reset all data</button>
      </div>
    </div>
  );
}
