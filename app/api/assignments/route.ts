import { NextResponse } from "next/server";

const assignments: { id: number; name: string }[] = [];

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
