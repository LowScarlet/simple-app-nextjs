import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    await delay(1000); // 1 second delay
    const { fullName, phoneNumber, password } = await req.json()
    
    const data = await myPrisma.user.findUnique({
      where: {
        phoneNumber
      }
    })
    if (data) {
      return NextResponse.json({ message: 'Phone number already exists' }, { status: 400 })
    }

    const data1 = await myPrisma.user.create({
      data: {
        fullName,
        phoneNumber,
        password
      }
    })
    return NextResponse.json(data1, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}