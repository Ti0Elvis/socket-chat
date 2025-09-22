"use client";
import { CardContent } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { Message } from "@/types/message";
import { CardMessage } from "./card-message";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { MessageSocketContext } from "@/context/socket-message";
import { find_all_messages_by_room_id } from "@/app/(root)/messages/actions";

interface Props {
  room_id: string;
}

export function ShowMessages({ room_id }: Readonly<Props>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const context = useContext(MessageSocketContext)!;
  const [messages, setMessages] = useState<Array<Message>>([]);

  const query = useQuery({
    queryKey: ["messages", room_id],
    queryFn: async () => {
      const response = await find_all_messages_by_room_id(room_id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      setMessages(response.data ?? []);
      return response.data;
    },
  });

  const { user } = useUser();

  useEffect(() => {
    context.socket?.on("send-message-success", (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      context.socket?.off("send-message-success");
    };
  }, [context.socket]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

  return (
    <CardContent className="flex-1 overflow-hidden">
      {query.isLoading === true && (
        <div className="p-4">Loading messages...</div>
      )}
      {query.data !== undefined && (
        <ScrollArea className="h-full">
          {messages.map((message) => {
            return (
              <CardMessage
                key={message._id}
                message={message}
                user_id={user?.id}
              />
            );
          })}
          <div ref={ref} />
        </ScrollArea>
      )}
    </CardContent>
  );
}
