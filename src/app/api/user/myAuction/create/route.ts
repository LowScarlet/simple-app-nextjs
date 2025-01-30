import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ message: 'User ID not found' }, { status: 401 });
    }

    const body = await req.json()
    let gggg = null;
    if (body.newCategory) {
      gggg = await myPrisma.category.create(
        {
          data: {
            name: body.newCategory,
          }
        }
      )
    }
    
    const data = await myPrisma.auction.create({
      data: {
        code: Math.random().toString(36).substring(7),
        icon: body.icon,
        title: body.title,
        description: body.description,
        startingBid: body.startingBid,
        endsAt: body.endsAt,
        method: body.method,
        status: body.status,
        isOpen: true,
        userId: parseInt(userId, 10),
        categoryId: gggg ? gggg.id : body.categoryId
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}