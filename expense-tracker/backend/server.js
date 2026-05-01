require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL || "https://expense-tracker-4scp.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/budgets", require("./routes/budgets"));
app.use("/api/savings", require("./routes/savings"));

app.get("/", (_req, res) =>
  res.json({ ok: true, name: "Expense Tracker API" }),
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Mongo connection failed:", e.message);
    process.exit(1);
  });
