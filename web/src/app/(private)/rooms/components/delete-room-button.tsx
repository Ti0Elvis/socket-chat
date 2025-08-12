"use client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Room } from "@/types/api";
import { delete_room } from "../actions";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { RoomSocketContext } from "../context/socket";
import { Fragment, useContext, useState } from "react";

interface Props {
  room: Room;
}

export function DeleteRoomButton({ room }: Readonly<Props>) {
  const [alertDialog, setAlertDialog] = useState(false);

  const context = useContext(RoomSocketContext)!;

  const mutation = useMutation({
    mutationKey: ["delete-room"],
    mutationFn: async () => {
      const response = await delete_room(room._id);

      if (response.ok === false) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: (message) => {
      setAlertDialog(false);
      context.socket?.emit("delete-room");
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full md:w-auto">
          Delete Room <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Room</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. All messages and
            saved content will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}>
            {mutation.isPending === true ? (
              "Loading..."
            ) : (
              <Fragment>
                Delete Room <Trash2Icon />
              </Fragment>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
