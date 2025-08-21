"use client";
import { useEffect, useState } from "react";

type Module = { id: number; name: string };
type Coursework = { 
  id: number; 
  assignmentId: number; 
  title: string; 
  deadline: string; 
  completed: boolean; 
  completedAt?: string 
};

export default function Home() {
  const [modules, setModules] = useState<Module[]>([]);
  const [coursework, setCoursework] = useState<Coursework[]>([]);
  const [moduleName, setModuleName] = useState("");
  const [cwTitle, setCwTitle] = useState("");
  const [cwDeadline, setCwDeadline] = useState("");
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  // Load modules and coursework
  useEffect(() => {
    fetch("/api/modules").then(r => r.json()).then(setModules);
    fetch("/api/coursework").then(r => r.json()).then(setCoursework);
  }, []);

  // Add module
  const addModule = async () => {
    if (!moduleName.trim()) return;
    const res = await fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: moduleName }),
    });
    const newModule = await res.json();
    setModules([...modules, newModule]);
    setModuleName("");
  };

  // Delete module and its coursework
  const deleteModule = async (id: number) => {
    await fetch("/api/modules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setModules(modules.filter(m => m.id !== id));
    setCoursework(coursework.filter(cw => cw.assignmentId !== id));
  };

  // Add coursework
  const addCoursework = async () => {
    if (!selectedModule || !cwTitle.trim() || !cwDeadline) return;
    const res = await fetch("/api/coursework", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignmentId: selectedModule,
        title: cwTitle,
        deadline: cwDeadline,
      }),
    });
    const newCW = await res.json();
    setCoursework([...coursework, newCW]);
    setCwTitle("");
    setCwDeadline("");
    setSelectedModule(null);
  };

  // Toggle completion
  const toggleCoursework = async (id: number, completed: boolean) => {
    await fetch("/api/coursework", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });
    setCoursework(coursework.map(cw =>
      cw.id === id
        ? { ...cw, completed, completedAt: completed ? new Date().toISOString() : undefined }
        : cw
    ));
  };

  // Delete coursework
  const deleteCoursework = async (id: number) => {
    await fetch("/api/coursework", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCoursework(coursework.filter(cw => cw.id !== id));
  };

  // Progress
  const total = coursework.length;
  const done = coursework.filter(cw => cw.completed).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>Coursework Tracker</h1>

      {/* Add Module */}
      <h2>Add Module</h2>
      <input
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
        placeholder="e.g. Algorithms"
      />
      <button onClick={addModule} style={{ marginLeft: "8px" }}>Add</button>
      <ul>
        {modules.map(m => (
          <li key={m.id}>
            {m.name}
            <button
              onClick={() => deleteModule(m.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add Coursework */}
      <h2>Add Coursework</h2>
      <select
        value={selectedModule ?? ""}
        onChange={(e) => setSelectedModule(Number(e.target.value))}
      >
        <option value="">Select Module</option>
        {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <input
        value={cwTitle}
        onChange={(e) => setCwTitle(e.target.value)}
        placeholder="e.g. Lab Report"
      />
      <input
        type="date"
        value={cwDeadline}
        onChange={(e) => setCwDeadline(e.target.value)}
      />
      <button onClick={addCoursework}>Add</button>

      {/* Progress */}
      <h2>Progress</h2>
      <div>{done}/{total} coursework completed ({progress}%)</div>
      <progress value={done} max={total}></progress>

      {/* Coursework grouped by module */}
      <h2>Coursework</h2>
      {modules.map(mod => (
        <div key={mod.id} style={{ marginTop: "15px" }}>
          <h3>{mod.name}</h3>
          {coursework.filter(cw => cw.assignmentId === mod.id).length === 0 ? (
            <p>No coursework yet</p>
          ) : (
            coursework
              .filter(cw => cw.assignmentId === mod.id)
              .map(cw => (
                <div key={cw.id} style={{ margin: "6px 0" }}>
                  <input
                    type="checkbox"
                    checked={cw.completed}
                    onChange={(e) => toggleCoursework(cw.id, e.target.checked)}
                  />
                  {cw.title} (due {cw.deadline})
                  {cw.completed && (
                    <span style={{ color: "green", marginLeft: "10px" }}>
                      Completed at {new Date(cw.completedAt!).toLocaleString()}
                    </span>
                  )}
                  <button 
                    onClick={() => deleteCoursework(cw.id)} 
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              ))
          )}
        </div>
      ))}
    </div>
  );
}
