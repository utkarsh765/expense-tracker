import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import { fmtINR, fmtDate } from "../utils/format";
import { useNavigate } from "react-router-dom";
import AddTransactionModal from "../components/AddTransactionModal";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    api.get("/transactions/summary").then((r) => setData(r.data));
  }, []);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    navigate("/transactions");
  };

  if (!data) return <div>Loading...</div>;

  const labels = Object.keys(data.byCategory);
  const values = Object.values(data.byCategory);

  const chart = {
    labels,
    datasets: [
      {
        data: values.length ? values : [1],
        backgroundColor: [
          "#4f46e5",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#3b82f6",
          "#8b5cf6",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5f5",
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {greeting}, {user?.name}
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Balance" value={data.balance} color="indigo" />
        <StatCard label="Income" value={data.income} color="green" />
        <StatCard label="Expense" value={data.expense} color="red" />
        <StatCard label="Savings" value={data.savings} color="amber" />
      </div>

      {/* Chart + Transactions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Expense by Category</h3>

          {labels.length ? (
            <div className="h-[260px]">
              <Doughnut data={chart} options={options} />
            </div>
          ) : (
            <p className="text-slate-500">No expenses yet.</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Recent Transactions</h3>

          <ul className="divide-y dark:divide-slate-700">
            {data.recent.map((t) => (
              <li key={t._id} className="py-2 flex justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-slate-500">
                    {fmtDate(t.date)} · {t.category}
                  </div>
                </div>

                <div
                  className={
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
                  {t.type === "income" ? "+" : "-"}
                  {fmtINR(t.amount)}
                </div>
              </li>
            ))}

            {!data.recent.length && (
              <p className="text-slate-500">No transactions yet.</p>
            )}
          </ul>
        </div>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
