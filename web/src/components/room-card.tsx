"use client";
import { Badge } from "./ui/badge";
import type { Room } from "@/types/api";
import { useClerk } from "@clerk/nextjs";
import { DeleteRoom } from "./delete-room";
import { JoinToRoom } from "./join-to-room";
import { formatDistanceToNow } from "date-fns";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { ClockIcon, GlobeIcon, UsersIcon } from "lucide-react";

interface Props {
  room: Room;
}

export function RoomCard({ room }: Readonly<Props>) {
  const { user } = useClerk();

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
        <JoinToRoom room={room} />
      </CardFooter>
    </Card>
  );
}
