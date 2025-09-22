import Link from "next/link";
import { Badge } from "./ui/badge";
import { Room } from "@/types/room";
import { Button } from "./ui/button";
import DeleteRoom from "./delete-room";
import { formatDistanceToNow } from "date-fns";
import { ClockIcon, GlobeIcon } from "lucide-react";
import { Card, CardFooter, CardHeader } from "./ui/card";

interface Props {
  room: Room;
  user_id?: string | null;
  setRooms: React.Dispatch<React.SetStateAction<Array<Room>>>;
}

export function CardRoom({ room, user_id, setRooms }: Props) {
  const is_owner = room.owner === user_id;

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
              <DeleteRoom room={room} owner_id={user_id} setRooms={setRooms} />
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
            <DeleteRoom room={room} owner_id={user_id} setRooms={setRooms} />
          </div>
        )}
        <Button className="w-full" asChild>
          <Link href={`/rooms/${room._id}`}>Join</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
