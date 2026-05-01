import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { fmtINR, fmtDate } from "../utils/format";

const empty = {
  name: "",
  amount: "",
  category: "Other",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => {
    const q = filter === "all" ? "" : `?type=${filter}`;
    api.get(`/transactions${q}`).then((r) => setItems(r.data));
  };
  useEffect(load, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount)
      return toast.error("Name and amount required");
    try {
      if (editing)
        await api.put(`/transactions/${editing}`, {
          ...form,
          amount: Number(form.amount),
        });
      else
        await api.post("/transactions", {
          ...form,
          amount: Number(form.amount),
        });
      toast.success("Saved");
      setOpen(false);
      setEditing(null);
      setForm(empty);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    toast.success("Deleted");
    load();
  };

  const edit = (t) => {
    setEditing(t._id);
    setForm({
      name: t.name,
      amount: t.amount,
      category: t.category,
      type: t.type,
      date: t.date.slice(0, 10),
      notes: t.notes || "",
    });
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm(empty);
            setOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add
        </button>
      </div>

      <div className="flex gap-2">
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg ${filter === f ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b dark:border-slate-700">
            <tr>
              <th className="p-3">Date</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t._id} className="border-b dark:border-slate-700">
                <td className="p-3">{fmtDate(t.date)}</td>
                <td>{t.name}</td>
                <td>
                  <span
                    className={
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {t.type}
                  </span>
                </td>
                <td>{t.category}</td>
                <td>{fmtINR(t.amount)}</td>
                <td>{t.notes}</td>
                <td className="text-right pr-3">
                  <button
                    onClick={() => edit(t)}
                    className="text-indigo-600 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(t._id)}
                    className="text-red-600"
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-500">
                  No transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={submit}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-3"
          >
            <h3 className="text-lg font-bold">
              {editing ? "Edit" : "Add"} Transaction
            </h3>
            <input
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="number"
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <select
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="date"
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <textarea
              className="w-full px-3 py-2 rounded border dark:bg-slate-700"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
