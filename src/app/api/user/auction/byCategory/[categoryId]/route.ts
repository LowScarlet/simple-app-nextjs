import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> | { categoryId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const categoryId = resolvedParams.categoryId;
    await delay(1000);

    const data = await myPrisma.auction.findMany({
      orderBy: {
        id: 'desc'
      },
      where: {
        categoryId: parseInt(categoryId, 10)
      },
      include: {
        bids: {
          orderBy: {
            amount: 'desc'
          },
          include: {
            user: true
          },
        },
        category: true,
        user: true,
      }
    });
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}