import { fmtINR } from "../utils/format";

export default function StatCard({ label, value, color = "indigo" }) {
  const map = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm 
                    flex items-center justify-between 
                    hover:scale-[1.02] transition duration-200"
    >
      {/* Left side */}
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="text-2xl font-bold mt-1">{fmtINR(value)}</div>
      </div>

      {/* Right side icon */}
      <div
        className={`w-12 h-12 rounded-xl ${map[color]} flex items-center justify-center text-white text-lg`}
      >
        ₹
      </div>
    </div>
  );
}
