"use client";
import { toast } from "sonner";
import { API } from "@/lib/constants";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

interface Context {
  socket: Socket | null;
}

export const RoomSocketContext = createContext<Context | null>(null);

interface Props {
  children: React.ReactNode;
}

export function RoomSocketProvider({ children }: Readonly<Props>) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket_rooms = io(`${API}/rooms`, {
      transports: ["websocket"],
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });

    socket_rooms.on("system-client-error", (data) => {
      toast.error(data.message);
    });

    setSocket(socket_rooms);

    return () => {
      socket_rooms.off("system-client-error");
      socket_rooms.disconnect();
    };
  }, []);

  return (
    <RoomSocketContext.Provider value={{ socket }}>
      {children}
    </RoomSocketContext.Provider>
  );
}
