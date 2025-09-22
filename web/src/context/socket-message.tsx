"use client";
import { API_URL } from "@/lib/constants";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

interface Context {
  socket: Socket | null;
}

export const MessageSocketContext = createContext<Context | null>(null);

interface Props {
  room_id?: string;
  children: React.ReactNode;
}

export function MessageSocketProvider({ children, room_id }: Readonly<Props>) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket_message = io(`${API_URL}/message`, {
      transports: ["websocket"],
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
      query: {
        room_id: room_id || "",
      },
    });

    setSocket(socket_message);

    return () => {
      socket_message.disconnect();
    };
  }, []);

  return (
    <MessageSocketContext.Provider value={{ socket }}>
      {children}
    </MessageSocketContext.Provider>
  );
}
