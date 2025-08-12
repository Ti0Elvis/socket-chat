"use client";
import { toast } from "sonner";
import { Fragment } from "react";
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
import { useClerk } from "@clerk/nextjs";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { delete_current_user } from "../actions";
import { useMutation } from "@tanstack/react-query";

export function DeleteCurrentUser() {
  const { signOut } = useClerk();

  const mutation = useMutation({
    mutationKey: ["delete-current-user"],
    mutationFn: async () => {
      signOut({ redirectUrl: "/welcome" });

      const response = await delete_current_user();

      if (response.ok === false) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message, {
        description:
          "Please sign in again to delete your account. If the issue persists, contact suppor",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleting Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. All your data,
            settings, and saved content will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}>
            {mutation.isPending === true ? (
              "Loading..."
            ) : (
              <Fragment>
                <Trash2Icon />
                Delete Account
              </Fragment>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
