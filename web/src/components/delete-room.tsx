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
import { Trash2Icon } from "lucide-react";
import { Fragment, useState } from "react";
import { socket_room } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { delete_room } from "@/app/(root)/rooms/actions";

interface Props {
  room: Room;
}

export function DeleteRoom({ room }: Readonly<Props>) {
  const [alertDialog, setAlertDialog] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-room"],
    mutationFn: async () => {
      const { data, error } = await delete_room(room._id);

      if (error !== undefined) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: (message) => {
      toast.success(message);
      socket_room.emit("delete-room");
      setAlertDialog(false);
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}>
            {isPending === true ? (
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
