// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ทำ logic สำหรับ logout เช่น เคลียร์ token, หรือตั้ง cookie เป็นว่าง
  // ตัวอย่าง: redirect ไปหน้าแรก
  return NextResponse.redirect("http://localhost:3000/");
}
