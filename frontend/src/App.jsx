import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error("Could not load tasks");
      setTasks(await response.json());
    } catch (err) {
      setError(`${err.message}. Check that the backend and MongoDB are running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    try {
      setSaving(true);
      setError("");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add task");
      setTasks((current) => [data, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not update task");
      setTasks((current) => current.map((item) => item._id === data._id ? data : item));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTask(id) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete task");
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <section className="app-card">
        <header className="header">
          <div>
            <p className="eyebrow">STAY ORGANIZED</p>
            <h1>My Tasks</h1>
            <p className="subtitle">A little progress every day adds up.</p>
          </div>
          <div className="counter">
            <strong>{completedCount}/{tasks.length}</strong>
            <span>completed</span>
          </div>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            maxLength={120}
            aria-label="New task title"
          />
          <button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Adding..." : "Add task"}
          </button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="list-heading">
          <h2>Task list</h2>
          <span>{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
        </div>

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <p>No tasks yet</p>
            <span>Add your first task above.</span>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-item ${task.completed ? "completed" : ""}`} key={task._id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => removeTask(task._id)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">Mini Task Manager · MERN stack</footer>
      </section>
    </main>
  );
}
