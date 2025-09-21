import { API_URL } from "./lib/constants";
import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/callback",
]);

export default clerkMiddleware(async (auth, request) => {
  try {
    const res = await fetch(new URL("", API_URL));

    if (!res.ok) {
      return NextResponse.json(
        { error: "Connection to API refused. Please try again later." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error connecting to API" },
      { status: 500 }
    );
  }

  if (isPublicRoute(request) === false) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
