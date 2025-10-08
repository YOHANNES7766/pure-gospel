// src/app/api/attendance/stats/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:8000/api/attendance/stats", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Attendance stats API error:", error);
    return NextResponse.json({ error: "Unable to load stats" }, { status: 500 });
  }
}
