# MERN Mini Task Manager

A small full-stack task manager built with React, Vite, Express, and MongoDB.

## Features
- Create tasks
- View all tasks
- Mark tasks as completed / pending
- Delete tasks

## Project structure
```text
mern-mini-task-manager/
├── backend/
└── frontend/
```

## Requirements
- Node.js (LTS)
- A MongoDB database (MongoDB Atlas or local MongoDB)

## 1. Configure the backend

Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and set your MongoDB connection string.

Windows CMD:
```cmd
copy .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:
```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Start the frontend

Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task completion |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | API health check |

## Notes
- Never commit your real `.env` file.
- `.env.example` contains only a placeholder.
- `node_modules` is intentionally not included.
