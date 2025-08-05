"use client";
import {
  ClockIcon,
  GlobeIcon,
  LoaderIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { socket_room } from "@/lib/socket";
import { find_all_rooms } from "../actions";
import { Fragment, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export function RenderRooms() {
  const { user } = useClerk();

  const query = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => await find_all_rooms(),
  });

  useEffect(() => {
    socket_room.on("refetch-all-rooms", () => {
      query.refetch();
    });

    return () => {
      socket_room.off("refetch-all-rooms");
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
      {query.isPending === false &&
        query.error === null &&
        query.data !== undefined && (
          <Fragment>
            {query.data?.data?.map((e, index) => {
              const is_owner = e.owner.clerk.id === user?.id;

              const is_participate = e.users.some(
                (e) => e.clerk.id === user?.id
              );

              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/60">
                  <CardHeader>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {e.name}
                      </h3>
                      {is_owner === true && (
                        <div className="hidden md:block">
                          <Button
                            variant="destructive"
                            className="w-full md:w-auto">
                            Delete Room <Trash2Icon />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-0.5">
                        <UsersIcon className="w-4 h-4" />
                        <p className="text-muted-foreground">
                          {e.users.length}
                        </p>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ClockIcon className="w-4 h-4" />
                        <p className="text-muted-foreground">
                          {formatDistanceToNow(e.createdAt, {
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
                      {is_participate === true && (
                        <Badge className="text-white">
                          You participate to this room
                        </Badge>
                      )}
                      <Badge variant="outline">{e.tag}</Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex flex-col gap-4">
                    <div className="block md:hidden w-full">
                      <Button
                        variant="destructive"
                        className="w-full md:w-auto">
                        Delete Room <Trash2Icon />
                      </Button>
                    </div>
                    <Button className="w-full">Join</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </Fragment>
        )}
    </Fragment>
  );
}
