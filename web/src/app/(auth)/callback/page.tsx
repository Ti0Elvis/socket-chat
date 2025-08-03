"use client";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { register_user_with_api } from "./actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const { push } = useRouter();

  useQuery({
    queryKey: ["register-user-with-api"],
    queryFn: async () => {
      const { message, error } = await register_user_with_api();

      if (error !== undefined) {
        throw new Error(error);
      }

      if (message !== undefined) {
        push("/rooms");
      }

      return message;
    },
    retry: true,
    retryDelay: 1250,
  });

  return (
    <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center">
      <span className="flex items-center gap-2">
        <LoaderIcon className="animate-spin" />
        Loading...
      </span>
      <h2>Please wait a moment while we register you on our server</h2>
      <p>You will be redirected to the rooms once the process is complete</p>
    </MaxWidthWrapper>
  );
}
