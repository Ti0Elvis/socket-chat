import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fragment } from "react";
import { UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@clerk/nextjs/server";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { DeleteMyOwnAccount } from "./components/delete-my-own-account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page() {
  const user = await currentUser();

  return (
    <Fragment>
      <MaxWidthWrapper className="py-12 space-y-4">
        <div className="flex gap-2 items-center">
          <div>
            <Avatar className="cursor-pointer size-24">
              <AvatarImage src={user?.imageUrl} alt="" />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <h2 className="text-4xl">{user?.fullName}</h2>
            <Badge>socket member</Badge>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon /> Personal Information
            </CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              Full Name:
              <br />{" "}
              <span className="text-muted-foreground text-sm">
                {user?.fullName}
              </span>
            </section>
            <section>
              Email:
              <br />{" "}
              <span className="text-muted-foreground text-sm">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </section>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <DeleteMyOwnAccount />
        </div>
      </MaxWidthWrapper>
    </Fragment>
  );
}
