import { NextResponse } from "next/server";

let tasks: { 
  id: number; 
  assignmentId: number; 
  title: string; 
  deadline: string; 
  completed: boolean; 
  completedAt?: string; 
}[] = [];

// tasks
export async function GET() {
  return NextResponse.json(tasks);
}

// new task
export async function POST(req: Request) {
  const body = await req.json();
  const newTask = { id: Date.now(), ...body, completed: false, completedAt: undefined };
  tasks.push(newTask);
  return NextResponse.json(newTask);
}

// update task
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, completed } = body;

  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed, completedAt: completed ? new Date().toISOString() : undefined }
      : task
  );

  return NextResponse.json({ success: true });
}
