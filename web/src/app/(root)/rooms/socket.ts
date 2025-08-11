import { API } from "@/lib/constants";
import { io } from "socket.io-client";

export const socket_rooms = io(`${API}/rooms`, {
  transports: ["websocket"],
  timeout: 20000,
  autoConnect: true,
  withCredentials: true,
});
