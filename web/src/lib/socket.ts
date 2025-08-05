import { API } from "./constants";
import { io } from "socket.io-client";

export const socket_room = io(`${API}/room`, {
  transports: ["websocket"],
  timeout: 20000,
  autoConnect: true,
  withCredentials: true,
});
