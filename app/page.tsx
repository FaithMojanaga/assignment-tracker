"use client";
import { useEffect, useState } from "react";

type Assignment = { id: number; name: string };
type Task = { id: number; assignmentId: number; title: string; deadline: string; completed: boolean; completedAt?: string };

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignmentName, setAssignmentName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    fetch("/api/assignments").then(r => r.json()).then(setAssignments);
    fetch("/api/tasks").then(r => r.json()).then(setTasks);
  }, []);

  // Add assignment
  const addAssignment = async () => {
    if (!assignmentName.trim()) return;
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: assignmentName }),
    });
    const newA = await res.json();
    setAssignments([...assignments, newA]);
    setAssignmentName("");
  };

  // Add task
  const addTask = async () => {
    if (!selectedAssignment || !taskTitle.trim() || !taskDeadline) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: selectedAssignment, title: taskTitle, deadline: taskDeadline }),
    });
    const newT = await res.json();
    setTasks([...tasks, newT]);
    setTaskTitle("");
    setTaskDeadline("");
    setSelectedAssignment(null);
  };

  // Toggle completion
  const toggleTask = async (id: number, completed: boolean) => {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, completed, completedAt: completed ? new Date().toISOString() : undefined }
        : t
    ));
  };

  // Progress
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Assignment Tracker</h1>

      <h2>Add Assignment</h2>
      <input
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        placeholder="Assignment name"
      />
      <button onClick={addAssignment} style={{ marginLeft: "8px" }}>Add</button>
      <ul>
        {assignments.map(a => <li key={a.id}>{a.name}</li>)}
      </ul>

      <h2>Add Task</h2>
      <select
        value={selectedAssignment ?? ""}
        onChange={(e) => setSelectedAssignment(Number(e.target.value))}
      >
        <option value="">Select Assignment</option>
        {assignments.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task title"
      />
      <input
        type="date"
        value={taskDeadline}
        onChange={(e) => setTaskDeadline(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <h2>Progress</h2>
      <div>{done}/{total} tasks done ({progress}%)</div>
      <progress value={done} max={total}></progress>

      <h2>Tasks</h2>
      {tasks.map(t => {
        const a = assignments.find(x => x.id === t.assignmentId);
        return (
          <div key={t.id} style={{ margin: "8px 0" }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={(e) => toggleTask(t.id, e.target.checked)}
            />
            {a?.name} - {t.title} (due {t.deadline})
            {t.completed && (
              <span style={{ color: "green", marginLeft: "10px" }}>
                Done at {new Date(t.completedAt!).toLocaleString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
