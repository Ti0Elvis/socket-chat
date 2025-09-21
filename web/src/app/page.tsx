import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default async function Page() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated === true) {
    return redirect("/rooms");
  }

  return (
    <SignedOut>
      <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-96">
          <CardHeader>
            <CardTitle>
              Welcome to <span className="text-primary">socket-chat!</span>
            </CardTitle>
            <CardDescription>
              This is a real-time chat demo project using sockets. It&#39;s
              intended purely as an example for learning and experimentation.
              <br />
              <br />
              If you like this project, consider giving it a ⭐ on GitHub — your
              support is appreciated!{" "}
              <Link
                href="https://github.com/Ti0Elvis/socket-chat"
                target="_blank"
                className="hover:underline text-primary"
              >
                Click here to go on GitHub
              </Link>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button>
              <Link href="/sign-in">Let&#39;s gooooooo!</Link>
            </Button>
          </CardFooter>
        </Card>
      </MaxWidthWrapper>
    </SignedOut>
  );
}
