import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/transactions', label: 'Transactions', icon: '💸' },
  { to: '/budget', label: 'Budget', icon: '📊' },
  { to: '/savings', label: 'Savings', icon: '🏦' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 hidden md:flex flex-col">
        <h1 className="text-xl font-bold mb-6">💰 Tracker</h1>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(l => (
            <NavLink
              key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`
              }>
              <span className="mr-2">{l.icon}</span>{l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={toggle} className="mt-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="mt-2 text-sm">
          <div className="px-3 py-2 truncate">{user?.name}</div>
          <button onClick={() => { logout(); nav('/login'); }} className="w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-left">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto"><Outlet /></main>
    </div>
  );
}
