// middleware.ts  ← di ROOT, bukan di hooks/
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/cart", "/notifications", "/checkout"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // =========================================================
  // TAMBAHAN BARU: PENGAMAN (GUARD) UNTUK MENCEGAH ERROR 500 DI VERCEL
  // =========================================================
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error("⚠️ Supabase URL atau ANON KEY belum diatur di Environment Variables Vercel/Local!");
    // Jika env tidak ada, lewati middleware agar web tidak crash
    return response; 
  }
  // =========================================================

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Belum login → tendang ke /login
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sudah login tapi buka /login atau /register → arahkan ke home
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};