import { API_URL } from "./lib/constants";
import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export async function middleware() {
  try {
    const res = await fetch(new URL("", API_URL));

    if (res.ok === false) {
      return NextResponse.json(
        { error: "Connection to API refused. Please try again later." },
        { status: 403, statusText: "" }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error connecting to API" },
      { status: 500, statusText: "" }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
