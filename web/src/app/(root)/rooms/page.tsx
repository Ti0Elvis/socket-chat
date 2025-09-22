import { MessageCircleIcon } from "lucide-react";
import { ShowRooms } from "@/components/show-rooms";
import { CreateRoom } from "@/components/create-room";
import { Card, CardContent } from "@/components/ui/card";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  return (
    <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 gap-8">
      <header className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Chat Rooms</h2>
        <p className="text-muted-foreground text-lg">
          Join a room to connect and chat with other users from around the world
        </p>
      </header>
      <ShowRooms />
      <footer>
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <MessageCircleIcon />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Create Your Own Room</h3>
              <p className="text-sm text-muted-foreground">
                Start a new conversation and invite others to join
              </p>
            </div>
            <div className="flex justify-center items-center">
              <CreateRoom />
            </div>
          </CardContent>
        </Card>
      </footer>
    </MaxWidthWrapper>
  );
}
