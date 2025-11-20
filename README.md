# Task Manager with Role-Based Access (RBAC)

A full-stack task management system built using React, Node.js, Express, SQLite, and JWT authentication.  
Users can manage their own tasks, while admins have access to view and delete all tasks.

## Features

### User Features
- Register and log in securely
- JWT-based authentication
- Create new tasks
- Edit own tasks
- Delete own tasks
- View only their own tasks

### Admin Features
- View all users’ tasks
- Tasks grouped under each username
- Delete any user's task

### Task Details
- Title (required)
- Description
- Status (pending, in-progress, completed)
- createdBy (user ID)
- createdAt (auto timestamp)


## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- SQLite (local database file)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- cors
- dotenv

### Database
- SQLite (`database.sqlite` auto-created on first run)

## API Endpoints

### Auth Routes
| Method | Endpoint        | Description              |
|--------|------------------|--------------------------|
| POST   | /api/register   | Register user/admin      |
| POST   | /api/login      | Login and get JWT token  |

---

### Task Routes
| Method | Endpoint            | Description                               |
|--------|----------------------|-------------------------------------------|
| POST   | /api/tasks          | Create a new task                          |
| GET    | /api/tasks          | User → own tasks, Admin → all tasks        |
| GET    | /api/tasks/:id      | Get a single task                          |
| PUT    | /api/tasks/:id      | Update task (user can update only own)     |
| DELETE | /api/tasks/:id      | Delete task (admin any, user only own)     |


