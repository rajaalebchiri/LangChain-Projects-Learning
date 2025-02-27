import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { message, type } = await req.json();

    


    return NextResponse.json(message, type)

}