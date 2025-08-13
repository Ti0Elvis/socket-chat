"use client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { RoomSocketContext } from "../context/socket";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useContext, useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const params = useParams<{ _id: string }>();

  const context = useContext(RoomSocketContext)!;

  const router = useRouter();

  useEffect(() => {
    //  Clean listeners before register
    context.socket?.off("join-notification");
    context.socket?.off("leave-notification");

    // Listening to join channel
    context.socket?.emit("join", { room_id: params._id, clerk_id: user?.id });

    context.socket?.on("join-notification", (data) => {
      toast.success(data.message);
    });

    // Listening to leave channel
    context.socket?.on("leave-notification", (data) => {
      toast.success(data.message);
    });

    // Listening if need to redirect
    context.socket?.on("redirect-to-rooms-page", () => {
      router.push("/rooms");
    });

    return () => {
      context.socket?.emit("leave", {
        room_id: params._id,
        clerk_id: user?.id,
      });

      // Set timeout to do everything correct
      setTimeout(() => {
        context.socket?.off("join-notification");
        context.socket?.off("leave-notification");
        context.socket?.off("redirect-to-rooms-page");
      }, 1250);
    };
  }, [params._id, user?.id, context.socket, router]);

  return <Fragment>{params._id}</Fragment>;
}
