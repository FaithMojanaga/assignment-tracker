import { NextResponse } from "next/server";

let assignments: { id: number; name: string }[] = [];

export async function GET() {
  return NextResponse.json(assignments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newAssignment = { id: Date.now(), name: body.name };
  assignments.push(newAssignment);
  return NextResponse.json(newAssignment);
}
