"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { find_all_rooms } from "../actions";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { RoomSocketContext } from "../context/socket";
import { Fragment, useContext, useEffect } from "react";
import { DeleteRoomButton } from "./delete-room-button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { ClockIcon, GlobeIcon, LoaderIcon, UsersIcon } from "lucide-react";

export function ShowRooms() {
  const { user } = useUser();
  const context = useContext(RoomSocketContext)!;

  const query = useQuery({
    queryKey: ["find-all-rooms"],
    queryFn: async () => {
      const response = await find_all_rooms();

      if (response.ok === false) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  useEffect(() => {
    context.socket?.on("refetch-all-rooms", () => {
      query.refetch();
    });

    return () => {
      context.socket?.off("refetch-all-rooms");
    };
  }, [context, query]);

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

  if (query.isPending === true) {
    return (
      <div className="flex items-center justify-center">
        <span className="flex items-center gap-2">
          <LoaderIcon className="animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  if (query.data.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold">No rooms found</h2>
      </div>
    );
  }

  return (
    <Fragment>
      {query.data?.map((e) => {
        const is_owner = e.owner?.clerk_id === user?.id;

        return (
          <Card
            key={e._id}
            className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/60">
            <CardHeader>
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {e.name}
                </h3>
                {is_owner === true && (
                  <div className="hidden md:block">
                    <DeleteRoomButton room={e} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-0.5">
                  <UsersIcon className="w-4 h-4" />
                  <p className="text-muted-foreground">{e?.users?.length}</p>
                </span>
                <span className="flex items-center gap-0.5">
                  <ClockIcon className="w-4 h-4" />
                  <p className="text-muted-foreground">
                    {e.createdAt !== undefined &&
                      formatDistanceToNow(e.createdAt, {
                        addSuffix: true,
                      })}
                  </p>
                </span>
                <span className="flex items-center gap-0.5">
                  <GlobeIcon className="w-4 h-4" />
                  <p className="text-muted-foreground">{e.language}</p>
                </span>
              </div>
              <div>
                <Badge variant="outline">{e.tag}</Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              {is_owner === true && (
                <div className="block md:hidden w-full">
                  <DeleteRoomButton room={e} />
                </div>
              )}
              <Button className="w-full" asChild>
                <Link href={`/rooms/${e._id}`}>Join</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </Fragment>
  );
}
