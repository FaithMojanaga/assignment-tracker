import { NextResponse } from "next/server";

let coursework: {
  id: number;
  assignmentId: number;
  title: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
}[] = [];

// Get all coursework
export async function GET() {
  return NextResponse.json(coursework);
}

// Add coursework
export async function POST(req: Request) {
  const body = await req.json();
  const newCW = {
    id: Date.now(),
    assignmentId: body.assignmentId,
    title: body.title,
    deadline: body.deadline,
    completed: false,
    completedAt: undefined,
  };
  coursework.push(newCW);
  return NextResponse.json(newCW);
}

// Toggle coursework completion
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, completed } = body;

  coursework = coursework.map(cw =>
    cw.id === id
      ? { ...cw, completed, completedAt: completed ? new Date().toISOString() : undefined }
      : cw
  );

  return NextResponse.json({ success: true });
}

// Delete coursework
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  coursework = coursework.filter(cw => cw.id !== id);
  return NextResponse.json({ success: true });
}
