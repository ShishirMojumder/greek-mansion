import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/** Runs only on /gm-admin/*. Refreshes the Supabase session cookie and blocks
 *  unauthenticated access. Full admin-role authorization is re-checked server-side
 *  in the protected layout and in every Server Action. */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet → admin area is disabled, send everyone to the public site.
  if (!url || !anon) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/gm-admin/login";

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/gm-admin/login", request.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/gm-admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/gm-admin/:path*"],
};
