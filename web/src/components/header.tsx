import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { currentUser } from "@clerk/nextjs/server";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export async function Header() {
  const user = await currentUser();

  return (
    <header className="w-full h-16 z-50 sticky top-0 left-0 border-b bg-background/75 backdrop-blur-md">
      <MaxWidthWrapper className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="object-cover"
            priority
          />
          <span className="text-primary text-lg font-bold">socket-chat</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedIn>
            <Button>
              <Link href="/rooms">ROOMS</Link>
            </Button>
            -
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignedOut>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
