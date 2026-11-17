import { NextResponse } from "next/server";

export async function middleware() {
  // Biarkan semua halaman lewat tanpa dicek login
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
