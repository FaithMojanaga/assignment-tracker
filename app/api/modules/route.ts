import { NextResponse } from "next/server";

let modules: { id: number; name: string }[] = [];

// Get all modules
export async function GET() {
  return NextResponse.json(modules);
}

// Add new module
export async function POST(req: Request) {
  const body = await req.json();
  const newModule = { id: Date.now(), name: body.name };
  modules.push(newModule);
  return NextResponse.json(newModule);
}

// Delete module
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  modules = modules.filter(m => m.id !== id);
  return NextResponse.json({ success: true });
}
