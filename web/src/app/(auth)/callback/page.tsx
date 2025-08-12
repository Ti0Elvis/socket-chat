"use client";
import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { register_current_user_on_api } from "./actions";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["register-current-user-on-api"],
    queryFn: async () => {
      const response = await register_current_user_on_api();

      if (response.ok === false) {
        throw new Error(response.error);
      }

      return response.data;
    },
    retry: true,
    retryDelay: 1250,
  });

  useEffect(() => {
    if (query.isSuccess) {
      router.push("/rooms");
    }
  }, [query.isSuccess, router]);

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

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
