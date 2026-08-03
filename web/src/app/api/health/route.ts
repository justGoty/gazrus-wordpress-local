import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    revision: process.env.APP_REVISION ?? "local",
  });
}
