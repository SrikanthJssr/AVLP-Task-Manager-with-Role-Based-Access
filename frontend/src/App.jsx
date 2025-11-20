import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEditTask from "./pages/CreateEditTask";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard (User + Admin both allowed) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Task (User Only) */}
        <Route
          path="/task/new"
          element={
            <ProtectedRoute>
              <CreateEditTask />
            </ProtectedRoute>
          }
        />

        {/* Edit Task (User only for own tasks) */}
        <Route
          path="/task/:id/edit"
          element={
            <ProtectedRoute>
              <CreateEditTask />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
