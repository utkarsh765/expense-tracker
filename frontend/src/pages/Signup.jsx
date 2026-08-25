import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields required');
    if (form.password.length < 6) return toast.error('Password must be 6+ chars');
    setLoading(true);
    try { await signup(form.name, form.email, form.password); toast.success('Account created'); nav('/'); }
    catch (err) { toast.error(err.response?.data?.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        <input className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" placeholder="Name"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" type="password" placeholder="Password (6+)"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-sm text-center">Have an account? <Link className="text-indigo-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
