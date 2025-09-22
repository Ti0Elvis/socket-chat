"use client";
import { Button } from "./ui/button";
import { CardRoom } from "./card-room";
import { useUser } from "@clerk/nextjs";
import type { Room } from "@/types/room";
import { LoaderIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { find_all_rooms } from "@/app/(root)/rooms/actions";

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

  if (query.error !== null) {
    throw new Error(query.error.message);
  }

  return (
    <Fragment>
      {rooms.map((room) => {
        return (
          <CardRoom
            key={room._id}
            room={room}
            user_id={user?.id}
            setRooms={setRooms}
          />
        );
      })}
      <Button onClick={() => query.refetch()} variant="outline">
        Load More
      </Button>
    </Fragment>
  );
}
