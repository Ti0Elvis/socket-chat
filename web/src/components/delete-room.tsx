"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "./ui/button";
import type { Room } from "@/types/room";
import { Trash2Icon } from "lucide-react";
import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { delete_room } from "@/app/(root)/rooms/actions";

interface Props {
  room: Room;
  owner_id: string;
  setRooms: React.Dispatch<React.SetStateAction<Array<Room>>>;
}

export default function DeleteRoom({
  room,
  owner_id,
  setRooms,
}: Readonly<Props>) {
  const [alertDialog, setAlertDialog] = useState(false);

  const mutation = useMutation({
    mutationKey: ["delete-room"],
    mutationFn: async () => {
      const response = await delete_room(room._id, owner_id);

      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: (message) => {
      setAlertDialog(false);
      setRooms((prevRooms) => prevRooms.filter((x) => x._id !== room._id));
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
            onClick={() => mutation.mutate()}
          >
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
