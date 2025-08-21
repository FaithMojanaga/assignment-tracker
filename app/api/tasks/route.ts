import { NextResponse } from "next/server";

let tasks: {
  id: number;
  assignmentId: number;
  title: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
}[] = [];

// Get all tasks
export async function GET() {
  return NextResponse.json(tasks);
}

// Add a new task
export async function POST(req: Request) {
  const body = await req.json();
  const newTask = {
    id: Date.now(),
    assignmentId: body.assignmentId,
    title: body.title,
    deadline: body.deadline,
    completed: false,
    completedAt: undefined,
  };
  tasks.push(newTask);
  return NextResponse.json(newTask);
}

// Toggle task completion
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

// Delete a task
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  tasks = tasks.filter(task => task.id !== id);

  return NextResponse.json({ success: true });
}
