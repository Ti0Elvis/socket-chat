"use client";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { register_user_on_nestjs_api } from "./actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const { push } = useRouter();

  useQuery({
    queryKey: ["register-user-on-nestjs-api"],
    queryFn: async () => {
      const response = await register_user_on_nestjs_api();

      if (response.status === 201) {
        push("/rooms");
      }

      return response.data;
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
