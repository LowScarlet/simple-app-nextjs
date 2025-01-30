import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ auctionId: string }> | { auctionId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const auctionId = resolvedParams.auctionId;
    const body = await req.json();
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ message: 'User ID not found' }, { status: 401 });
    }
    await delay(1000);

    const data = await myPrisma.auction.update({
      where: {
        id: parseInt(auctionId, 10)
      },
      data: {
        resi: body.resi,
        status: 'Closed_OnSent'
      },
    });
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}