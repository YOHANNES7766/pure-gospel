// src/app/api/attendance/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:8000/api/attendance", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch attendance data");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Attendance API error:", error);
    return NextResponse.json({ error: "Unable to load attendance" }, { status: 500 });
  }
}
