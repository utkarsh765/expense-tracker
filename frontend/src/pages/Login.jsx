import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    try { await login(form.email, form.password); toast.success('Welcome back!'); nav('/'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <input className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-center">No account? <Link className="text-indigo-600" to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
}
