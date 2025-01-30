import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    await delay(1000); // 1 second delay
    const { phoneNumber, password } = await req.json()
    const data = await myPrisma.user.findUnique({
      where: {
        phoneNumber,
        password
      }
    })
    if (data) {
      return NextResponse.json(data, { status: 200 })
    }
    return NextResponse.json({ message: 'Unknown Credentials' }, { status: 400 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}