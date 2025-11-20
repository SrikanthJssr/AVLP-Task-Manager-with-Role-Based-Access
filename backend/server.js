const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database initialize
const db = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

/* ---------------------------------------------------------
   TEMP DEBUG ROUTES (Use ONLY for testing SQLite)
------------------------------------------------------------ */

// Show all users
app.get("/debug-users", (req, res) => {
  db.all("SELECT id, username, role FROM users", [], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

// Show all tasks
app.get("/debug-tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

// Make a user admin (ex: /make-admin/1)
app.get("/make-admin/:id", (req, res) => {
  db.run(
    "UPDATE users SET role='admin' WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.json({ message: "Error updating role" });
      res.json({ message: "User promoted to admin" });
    }
  );
});

/* ---------------------------------------------------------
   END DEBUG ROUTES
------------------------------------------------------------ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
