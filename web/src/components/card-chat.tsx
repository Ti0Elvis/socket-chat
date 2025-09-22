"use client";
import Link from "next/link";
import { Room } from "@/types/room";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { SendMessage } from "./send-message";
import { Card, CardHeader } from "./ui/card";
import { ShowMessages } from "./show-messages";
import { useQuery } from "@tanstack/react-query";
import { find_all_messages_by_room_id } from "@/app/(root)/messages/actions";

interface Props {
  room: Room;
}

export function CardChat({ room }: Readonly<Props>) {
  const query = useQuery({
    queryKey: ["messages", room._id],
    queryFn: async () => {
      const response = await find_all_messages_by_room_id(room._id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!room._id,
  });

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

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
      {query.isLoading === true && (
        <div className="p-4">Loading messages...</div>
      )}
      {query.data !== undefined && (
        <ShowMessages previous_messages={query.data} />
      )}
      <SendMessage room_id={room._id} />
    </Card>
  );
}
