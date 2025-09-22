"use client";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import DeleteRoom from "./delete-room";
import { useUser } from "@clerk/nextjs";
import type { Room } from "@/types/room";
import { Fragment, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { find_all_rooms } from "@/app/(root)/rooms/actions";
import { ClockIcon, GlobeIcon, LoaderIcon } from "lucide-react";

export function ShowRooms() {
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<Array<Room>>([]);

  const { user } = useUser();

  const query = useQuery({
    queryKey: ["find-all-rooms"],
    queryFn: async () => {
      const response = await find_all_rooms(page);

      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      if (response.data !== undefined && response.data.length > 0) {
        setRooms((prevRooms) => [...prevRooms, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      }

      return response.data;
    },
  });

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

  if (rooms !== undefined && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold">No rooms found</h2>
      </div>
    );
  }

  return (
    <Fragment>
      {rooms.map((room) => {
        const is_owner = room.owner === user?.id;

        return (
          <Card
            key={room._id}
            className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/60"
          >
            <CardHeader>
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                {is_owner === true && (
                  <div className="hidden md:block">
                    <DeleteRoom
                      room={room}
                      owner_id={user?.id}
                      setRooms={setRooms}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-0.5">
                  <ClockIcon className="w-4 h-4" />
                  <p className="text-muted-foreground">
                    {room.createdAt !== undefined &&
                      formatDistanceToNow(room.createdAt, {
                        addSuffix: true,
                      })}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  <GlobeIcon className="w-4 h-4" />
                  <p className="text-muted-foreground">{room.language}</p>
                </div>
              </div>
              <div>
                <Badge variant="outline">{room.tag}</Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              {is_owner === true && (
                <div className="block md:hidden w-full">
                  <DeleteRoom
                    room={room}
                    owner_id={user?.id}
                    setRooms={setRooms}
                  />
                </div>
              )}
              <Button className="w-full" asChild>
                <Link href={`/rooms/${room._id}`}>Join</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      <Button onClick={() => query.refetch()} variant="outline">
        Load More
      </Button>
    </Fragment>
  );
}
