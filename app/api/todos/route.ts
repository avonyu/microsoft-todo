import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from '@/lib/prisma'
import { randomUUID } from 'crypto';

// 获取所有待办事项
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return;

  try {
    const todos = await prisma.todoTask.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId: session.user.id
      }
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// 创建新待办事项
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return;

  try {
    const { content } = await request.json();

    const todo = await prisma.todoTask.create({
      data: {
        id: randomUUID(),
        content,
        userId: session.user.id,
      }
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
