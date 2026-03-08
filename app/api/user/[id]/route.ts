import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return;

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    console.log(user);
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}