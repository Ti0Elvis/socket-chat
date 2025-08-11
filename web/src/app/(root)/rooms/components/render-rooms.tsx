"use client";
import { CardRoom } from "./card-room";
import { LoaderIcon } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { socket_rooms } from "@/app/(root)/rooms/socket";
import { find_all_rooms } from "@/app/(root)/rooms/actions";

export function RenderRooms() {
  const query = useQuery({
    queryKey: ["find-all-rooms"],
    queryFn: async () => await find_all_rooms(),
  });

  useEffect(() => {
    socket_rooms.on("refetch-all-rooms", () => {
      query.refetch();
    });

    return () => {
      socket_rooms.off("refetch-all-rooms");
    };
  }, []);

  if (query.error !== null) {
    throw new Error("Error while finding all rooms");
  }

  return (
    <Fragment>
      {query.isPending === true && (
        <div className="flex items-center justify-center">
          <span className="flex items-center gap-2">
            <LoaderIcon className="animate-spin" />
            Loading...
          </span>
        </div>
      )}
      {query.isPending === false && query.error === null && (
        <Fragment>
          {query.data.rooms !== undefined && query.data.rooms?.length === 0 && (
            <Fragment>
              <div className="flex items-center justify-center">
                <h2>No rooms found</h2>
              </div>
            </Fragment>
          )}
          {query.data.rooms !== undefined && query.data.rooms?.length > 0 && (
            <Fragment>
              {query.data?.rooms?.map((e) => {
                return <CardRoom key={e._id} room={e} />;
              })}
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
