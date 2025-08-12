import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@clerk/nextjs/server";
import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { is_registered_current_user_on_api } from "../actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Header() {
  const user = await currentUser();
  const response = await is_registered_current_user_on_api();

  return (
    <header className="w-full h-16 sticky top-0 left-0 border-b bg-background/75 backdrop-blur-md">
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
          {response.ok === true && (
            <SignedIn>
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
                    <SignOutButton signOutOptions={{ redirectUrl: "/welcome" }}>
                      <p className="w-full">Sign out</p>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
          )}
          <ModeToggle />
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
