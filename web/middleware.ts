import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = cookies().get("session")?.value;
  const userType = cookies().get("user")?.value;
  const { pathname } = request.nextUrl;

  // Define paths that require authentication
  const restrictedPaths = [
    "/teacher",
    "/student",
    "/teacher/:groupId/progress",
  ];
  const publicPaths = [
    "/teacher/signup",
    "/teacher/login",
    "/student/signup",
    "/student/login",
    "/",
  ];

  // If no session cookie and accessing restricted paths, redirect to /login
  if (
    !sessionCookie &&
    restrictedPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If session cookie exists and accessing public paths, redirect to /home
  if (sessionCookie && publicPaths.includes(pathname)) {
    if (userType === "STUDENT") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (userType === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }
  }

  // Paths that require userType "TEACHER"
  const teacherPaths = ["/teacher", "/teacher/:groupId/progress"];
  if (
    sessionCookie &&
    teacherPaths.includes(pathname) &&
    userType === "STUDENT"
  ) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // Paths that require userType "STUDENT"
  const studentPaths = ["/student"];
  if (
    sessionCookie &&
    studentPaths.includes(pathname) &&
    userType === "TEACHER"
  ) {
    return NextResponse.redirect(new URL("/teacher", request.url));
  }

  return NextResponse.next(); // Allow the request to continue if no conditions are met
}

export const config = {
  matcher: ["/", "/teacher", "/student", "/teacher/:groupId/progress"],
};
