import { useState } from "react";
import api from "../api/axios";

export default function AddTransactionModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Other",
    type: "expense",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await api.post("/transactions", form);
    onClose();
    window.location.reload(); // simple refresh (later we optimize)
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-2xl w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        />

        <input
          name="amount"
          placeholder="Amount"
          type="number"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        />

        <select
          name="category"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="type"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="date"
          name="date"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          className="w-full mb-3 p-2 rounded bg-slate-700"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
