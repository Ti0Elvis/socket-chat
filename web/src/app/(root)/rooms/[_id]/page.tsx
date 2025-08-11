"use client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { socket_rooms } from "../socket";
import { useParams } from "next/navigation";
import { Fragment, useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const params = useParams<{ _id: string }>();

  /* 
    Bug: When a user opens the same room in two or more browser tabs, two socket connections are created. Each connection is independent. 
    When one tab closes and disconnects its socket, the server thinks the user left the room entirely, even though the other tab is still connected. 
    This causes the user to appear disconnected from the room, even though they are still connected from the other tab.
  */
  useEffect(() => {
    if (!!user?.id === false) {
      return;
    }

    // Clean listeners before registe
    socket_rooms.off("join-notification");
    socket_rooms.off("leave-notification");

    // Listening to join channel
    socket_rooms.emit("join", { room_id: params._id, clerk_id: user.id });

    socket_rooms.on("join-notification", (data) => {
      toast.success(data.message);
    });

    // Listening to leave channel
    socket_rooms.on("leave-notification", (data) => {
      toast.success(data.message);
    });

    return () => {
      socket_rooms.emit("leave", {
        room_id: params._id,
        clerk_id: user.id,
      });

      // Set timeout to do everything correct
      setTimeout(() => {
        socket_rooms.off("join-notification");
        socket_rooms.off("leave-notification");
      }, 250);
    };
  }, [params._id, user?.id]);

  return <Fragment>{params._id}</Fragment>;
}
