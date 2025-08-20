"use client";
import { useState } from "react";

// Assignment type
type Assignment = {
  id: number;
  name: string;
};

// Task type
type Task = {
  id: number;
  assignmentId: number;
  title: string;
  deadline: string;
  completed: boolean;
};

export default function Home() {
  // State for assignments and tasks
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Inputs
  const [assignmentName, setAssignmentName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

  // Add new assignment
  const addAssignment = () => {
    if (!assignmentName.trim()) return;
    const newAssignment = { id: Date.now(), name: assignmentName };
    setAssignments([...assignments, newAssignment]);
    setAssignmentName(""); // reset input
  };

  // Add new task
  const addTask = () => {
    if (!taskTitle.trim() || !taskDeadline || !selectedAssignment) return;
    const newTask = {
      id: Date.now(),
      assignmentId: selectedAssignment,
      title: taskTitle,
      deadline: taskDeadline,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskDeadline("");
    setSelectedAssignment(null);
  };

  // Toggle completed
  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Progress calculation
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="container">
      <h1>Assignment Tracker</h1>

      {/* Add Assignment */}
      <div className="box">
        <h2>Add Assignment</h2>
        <input
          type="text"
          value={assignmentName}
          onChange={(e) => setAssignmentName(e.target.value)}
          placeholder="Assignment name"
        />
        <button onClick={addAssignment}>Add Assignment</button>

        <ul>
          {assignments.map((a) => (
            <li key={a.id}>{a.name}</li>
          ))}
        </ul>
      </div>

      {/* Add Task */}
      <div className="box">
        <h2>Add Task</h2>
        <select
          value={selectedAssignment ?? ""}
          onChange={(e) => setSelectedAssignment(Number(e.target.value))}
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="box">
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => {
            const assignment = assignments.find((a) => a.id === task.assignmentId);
            const daysLeft =
              (new Date(task.deadline).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24);

            let colorClass = "green";
            if (daysLeft < 3) colorClass = "red";
            else if (daysLeft < 7) colorClass = "yellow";

            return (
              <div key={task.id} className={`task ${colorClass}`}>
                <div>
                  <strong>{assignment?.name} - {task.title}</strong>
                  <div>Deadline: {task.deadline} ({Math.floor(daysLeft)} days left)</div>
                </div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Progress */}
      <div className="box">
        <h2>Progress</h2>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercent}%` }}>
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>
    </div>
  );
}
