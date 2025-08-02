import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ModeToggle } from "@/components/mode-toggle";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Header() {
  const user = await currentUser();

  return (
    <header className="w-full h-16 border-b">
      <MaxWidthWrapper className="flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          objectFit="cover"
          priority
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.imageUrl} alt="" />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/rooms">Rooms</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
                  <p className="w-full">Sign out</p>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
