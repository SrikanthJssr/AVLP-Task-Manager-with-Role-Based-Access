import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ⭐ Group tasks by username (only for admin)
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.username]) acc[task.username] = [];
    acc[task.username].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Welcome, {user.username} ({user.role})
        </h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Admin/User Heading */}
      <h3 className="text-xl font-semibold mb-4">
        {user.role === "admin" ? "All Tasks (Admin View)" : "Your Tasks"}
      </h3>

      <div className="flex justify-end mb-4">
        <Link
          to="/task/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Task
        </Link>
      </div>

      {/* ⭐ Admin View – Group by Username */}
      {user.role === "admin" ? (
        <div className="space-y-8">
          {Object.keys(groupedTasks).map((username) => (
            <div key={username}>
              <h2 className="text-xl font-bold mb-3">
                👤 {username}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedTasks[username].map((task) => (
                  <div key={task.id} className="bg-white p-4 shadow rounded">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Status: {task.status}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ⭐ Regular user view (same as before) */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 shadow rounded">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-blue-600 mt-1">
                Status: {task.status}
              </p>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/task/${task.id}/edit`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
