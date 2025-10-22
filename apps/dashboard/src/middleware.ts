import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthRoute, isProtectedRoute } from "./core/lib/routes";
import { verifyToken } from "./core/lib/utils";


export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname

  const isAuth = isAuthRoute(pathname)
  const isProtected = isProtectedRoute(pathname)

  if (!isAuth && !isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }else {
      return NextResponse.next();
    }
  }

  let decoded: JwtPayload | null = null
  try {
    decoded = await verifyToken(token);
  } catch {}

  if (!decoded && isProtected) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }

  if (isAuth) {
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    return res;
  }
  const res = NextResponse.next();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
