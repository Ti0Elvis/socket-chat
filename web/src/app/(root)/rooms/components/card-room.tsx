"use client";
import Link from "next/link";
import type { Room } from "@/types/api";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ClockIcon, GlobeIcon, UsersIcon } from "lucide-react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { DeleteRoom } from "@/app/(root)/rooms/components/delete-room";

export function CardRoom({ room }: Readonly<{ room: Room }>) {
  const { user } = useUser();
  const is_owner = room.owner.clerk.id === user?.id;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/60">
      <CardHeader>
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {room.name}
          </h3>
          {is_owner === true && (
            <div className="hidden md:block">
              <DeleteRoom room={room} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-0.5">
            <UsersIcon className="w-4 h-4" />
            <p className="text-muted-foreground">{room.users.length}</p>
          </span>
          <span className="flex items-center gap-0.5">
            <ClockIcon className="w-4 h-4" />
            <p className="text-muted-foreground">
              {formatDistanceToNow(room.createdAt, {
                addSuffix: true,
              })}
            </p>
          </span>
          <span className="flex items-center gap-0.5">
            <GlobeIcon className="w-4 h-4" />
            <p className="text-muted-foreground">{room.language}</p>
          </span>
        </div>
        <div>
          <Badge variant="outline">{room.tag}</Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col gap-4">
        {is_owner === true && (
          <div className="block md:hidden w-full">
            <DeleteRoom room={room} />
          </div>
        )}
        <Button className="w-full" asChild>
          <Link href={`/rooms/${room._id}`}>Join</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
