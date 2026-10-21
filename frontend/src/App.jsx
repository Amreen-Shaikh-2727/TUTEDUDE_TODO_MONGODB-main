
import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  editTask,
  updateTaskStatus,
  deleteTask,
} from "./api/taskApi";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTasks(search);

        if (active) {
          setTasks(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load tasks. Check your backend."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter a task.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await addTask({ text: text.trim(), priority });
      setText("");
      setPriority("medium");

      const response = await getTasks(search);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add task.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (task) => {
    if (!editText.trim()) {
      setError("Task cannot be empty.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await editTask(task._id, {
        text: editText.trim(),
        priority: task.priority,
      });

      setEditingId(null);
      const response = await getTasks(search);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to edit task.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (task) => {
    setError("");

    try {
      const response = await updateTaskStatus(
        task._id,
        !task.completed
      );

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id ? response.data : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update task status."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    setError("");

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "all" || task.priority === filter
  );

  return (
    <main className="container">
      <section className="todo-box">
        <h1>My Todo List</h1>
        <p className="subtitle">Organize your daily tasks</p>

        <form className="add-form" onSubmit={handleAdd}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a task..."
            aria-label="Task text"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Task priority"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button disabled={saving}>
            {saving ? "Saving..." : "Add"}
          </button>
        </form>

        <div className="toolbar">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setSearch(search)}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p className="message">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="message">No tasks found.</p>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div className="task-item" key={task._id}>
                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
                  onChange={() => handleStatus(task)}
                  aria-label={`Mark ${task.text} ${
                    task.completed ? "not done" : "done"
                  }`}
                />

                <div className="task-details">
                  {editingId === task._id ? (
                    <form
                      className="edit-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit(task);
                      }}
                    >
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />

                      <button disabled={saving}>Save</button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <span
                      className={
                        task.completed ? "task-text completed" : "task-text"
                      }
                    >
                      {task.text}
                    </span>
                  )}

                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>

                  <span className="status">
                    {task.completed ? "Done" : "Not done"}
                  </span>
                </div>

                {editingId !== task._id && (
                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(task._id);
                        setEditText(task.text);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
