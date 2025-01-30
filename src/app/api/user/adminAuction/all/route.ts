/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
  try {
    await delay(1000);
    const data = await myPrisma.auction.findMany({
      orderBy: {
        id: 'desc'
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
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}