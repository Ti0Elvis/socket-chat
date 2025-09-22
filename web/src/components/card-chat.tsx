"use client";
import Link from "next/link";
import { Room } from "@/types/room";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { SendMessage } from "./send-message";
import { Card, CardHeader } from "./ui/card";
import { ShowMessages } from "./show-messages";

interface Props {
  room: Room;
}

export function CardChat({ room }: Readonly<Props>) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b flex items-center justify-between">
        <h2 className="font-bold">Room name: {room.name}</h2>
        <Button variant="outline" asChild>
          <Link href="/rooms">
            <LogOutIcon />
          </Link>
        </Button>
      </CardHeader>
      <ShowMessages room_id={room._id} />
      <SendMessage room_id={room._id} />
    </Card>
  );
}
