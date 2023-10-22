import { NextResponse } from "next/server"
export const notFound = () =>
  new NextResponse("not found", { status: 404 })
