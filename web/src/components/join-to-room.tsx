"use client";
import { toast } from "sonner";
import type { Room } from "@/types/api";
import { socket_room } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { join_to_room } from "@/app/(root)/rooms/actions";

interface Props {
  room: Room;
}

export function JoinToRoom({ room }: Readonly<Props>) {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["join-to-room"],
    mutationFn: async () => {
      const { data, error } = await join_to_room(room._id);

      if (error !== undefined) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: (message) => {
      toast.success(message);
      push(`/rooms/${room._id}`);

      socket_room.emit("join-to-room");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button className="w-full" disabled={isPending} onClick={() => mutate()}>
      {isPending === true ? "Loading..." : "Join"}
    </Button>
  );
}
