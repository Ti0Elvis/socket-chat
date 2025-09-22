"use client";
import { CardContent } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { Message } from "@/types/message";
import { CardMessage } from "./card-message";
import { ScrollArea } from "./ui/scroll-area";
import { useContext, useEffect, useState } from "react";
import { MessageSocketContext } from "@/context/socket-message";

interface Props {
  previous_messages: Array<Message>;
}

export function ShowMessages({ previous_messages }: Readonly<Props>) {
  const context = useContext(MessageSocketContext)!;
  const [messages, setMessages] = useState<Array<Message>>(previous_messages);

  const { user } = useUser();

  useEffect(() => {
    context.socket?.on("send-message-success", (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      context.socket?.off("send-message-success");
    };
  }, [context.socket]);

  return (
    <CardContent className="flex-1 overflow-hidden">
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
      </ScrollArea>
    </CardContent>
  );
}
