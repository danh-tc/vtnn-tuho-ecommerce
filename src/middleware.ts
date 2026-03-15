import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Protect /admin routes - must be admin or staff
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/dang-nhap?from=admin", req.url));
    }
    if (user.role === "customer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /tai-khoan routes - must be logged in
  if (pathname.startsWith("/tai-khoan")) {
    if (!user) {
      return NextResponse.redirect(
        new URL(`/dang-nhap?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/tai-khoan/:path*"],
};
