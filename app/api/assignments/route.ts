import { NextResponse } from "next/server";

// Use let so we can modify the array
let assignments: { id: number; name: string }[] = [];

// Optional: in-memory tasks array to delete associated tasks
let tasks: { id: number; assignmentId: number; title: string; deadline: string; completed: boolean; completedAt?: string }[] = [];

// Get all assignments
export async function GET() {
  return NextResponse.json(assignments);
}

// Add new assignment
export async function POST(req: Request) {
  const body = await req.json();
  const newAssignment = { id: Date.now(), name: body.name };
  assignments.push(newAssignment);
  return NextResponse.json(newAssignment);
}

// Delete an assignment
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  assignments = assignments.filter(a => a.id !== id);
  tasks = tasks.filter(t => t.assignmentId !== id);

  return NextResponse.json({ success: true });
}
