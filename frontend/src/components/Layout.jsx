import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  PiggyBank,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/budget", label: "Budget", icon: PieChart },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 hidden md:flex flex-col">
        <h1 className="text-xl font-bold mb-6">Tracker</h1>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between mt-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <div className="flex items-center">
            {theme === "dark" ? (
              <Sun className="w-5 h-5 mr-3" />
            ) : (
              <Moon className="w-5 h-5 mr-3" />
            )}

            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>

          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                theme === "dark" ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>
        <div className="mt-2 text-sm">
          <div className="px-3 py-2 truncate">{user?.name}</div>
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
            className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-left"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
