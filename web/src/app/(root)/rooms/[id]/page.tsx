"use client";
import { toast } from "sonner";
import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { find_room_by_id } from "./actions";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { MessageSocketProvider } from "@/context/socket-message";

export default function Page() {
  const params = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["room", params.id],
    queryFn: async () => {
      const response = await find_room_by_id(params.id);

      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    toast.success("Welcome");

    return () => {
      toast.success("Goodbye");
    };
  }, []);

  if (query.isPending === true) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="flex items-center gap-2">
          <LoaderIcon className="animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

  return (
    <MaxWidthWrapper className="w-full h-[calc(100vh-4rem)] py-12">
      <MessageSocketProvider>
        Connecting to room {query.data._id}
      </MessageSocketProvider>
    </MaxWidthWrapper>
  );
}
