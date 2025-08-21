import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const { assignmentId, title, deadline } = await req.json();
  const task = await prisma.task.create({
    data: { assignmentId, title, deadline },
  });
  return NextResponse.json(task);
}

export async function PATCH(req: Request) {
  const { id, completed } = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  return NextResponse.json(task);
}
