const db = require('../models');

// Create Task
exports.createTask = (req, res) => {
  const { title, description, status } = req.body;

  const query = `INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)`;

  db.run(query, [title, description, status || 'pending', req.user.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error creating task' });
    res.json({ message: 'Task created', taskId: this.lastID });
  });
};

// Get Tasks (Admin = all with usernames, User = own with usernames)
exports.getTasks = (req, res) => {
  let query;
  let params;

  if (req.user.role === 'admin') {
    // ADMIN → All tasks with username
    query = `
      SELECT tasks.*, users.username
      FROM tasks
      JOIN users ON tasks.createdBy = users.id
      ORDER BY users.username ASC, tasks.id DESC
    `;
    params = [];
  } else {
    // USER → Only own tasks with username
    query = `
      SELECT tasks.*, users.username
      FROM tasks
      JOIN users ON tasks.createdBy = users.id
      WHERE createdBy = ?
      ORDER BY tasks.id DESC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching tasks' });
    res.json(rows);
  });
};

// Get Task by ID
exports.getTaskById = (req, res) => {
  const query = `
    SELECT tasks.*, users.username
    FROM tasks
    JOIN users ON tasks.createdBy = users.id
    WHERE tasks.id = ?
  `;

  db.get(query, [req.params.id], (err, task) => {
    if (err || !task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  });
};

// Update Task (User can edit only own)
exports.updateTask = (req, res) => {
  const { title, description, status } = req.body;

  const query = `UPDATE tasks SET title=?, description=?, status=? WHERE id=? AND createdBy=?`;

  db.run(
    query,
    [title, description, status, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error updating task' });

      if (this.changes === 0) {
        return res.status(403).json({ message: 'Not allowed to update this task' });
      }

      res.json({ message: 'Task updated' });
    }
  );
};

// Delete Task (Admin = any task, User = own task)
exports.deleteTask = (req, res) => {
  if (req.user.role === 'admin') {
    db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function (err) {
      if (err) return res.status(500).json({ message: 'Error deleting task' });
      return res.json({ message: 'Task deleted' });
    });
  } else {
    db.run(
      `DELETE FROM tasks WHERE id = ? AND createdBy = ?`,
      [req.params.id, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ message: 'Error deleting task' });

        if (this.changes === 0) {
          return res.status(403).json({ message: 'Not allowed to delete this task' });
        }

        res.json({ message: 'Task deleted' });
      }
    );
  }
};
