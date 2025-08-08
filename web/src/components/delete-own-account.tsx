"use client";
import { toast } from "sonner";
import { Fragment } from "react";
import { delay } from "@/lib/utils";
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
import { useMutation } from "@tanstack/react-query";
import { delete_own_account } from "@/app/(root)/profile/actions";

export function DeleteMyOwnAccount() {
  const { signOut } = useClerk();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-own-account"],
    mutationFn: async () => {
      await delay(1250); // Set a delay only to user experience

      signOut({ redirectUrl: "/" });

      const { data, error } = await delete_own_account();

      if (error !== undefined) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message, {
        description:
          "Please sign-in again and try to delete your account. If this problem persist please contact me to solve it",
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}>
            {isPending === true ? (
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
