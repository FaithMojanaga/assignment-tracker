import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const assignments = await prisma.assignment.findMany();
  return NextResponse.json(assignments);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const assignment = await prisma.assignment.create({ data: { name } });
  return NextResponse.json(assignment);
}
