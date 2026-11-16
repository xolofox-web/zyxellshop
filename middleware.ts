import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Kalau env belum masuk, langsung loloskan (jangan crash)
  if (!supabaseUrl || !supabaseKey) {
    console.error("ENV SUPABASE KOSONG DI MIDDLEWARE!");
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/profile", "/cart", "/notifications"];
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if ((pathname === "/login" || pathname === "/register") && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (error) {
    // JIKA SUPABASE CRASH / TIMEOUT, WEB TETAP TERBUKA
    console.error("Middleware Supabase Error:", error);
    return NextResponse.next({ request });
  }
}

export const config = {
  // PENTING: TAMBAHKAN "api" AGAR MIDDLEWARE TIDAK MENGGANGGU WEBHOOK CASHI.ID
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
