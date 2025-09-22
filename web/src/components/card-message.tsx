import { cn } from "@/lib/utils";
import { Message } from "@/types/message";

interface Props {
  message: Message;
  user_id: string | undefined;
}

export function CardMessage({ message, user_id }: Readonly<Props>) {
  const is_mine = message.sender.clerk_id === user_id;

  return (
    <div
      className={cn("my-2", {
        "opacity-50": message.is_deleted,
        "text-right": is_mine === true,
        "text-left": is_mine === false,
      })}
    >
      <header>
        <span className="text-xs font-medium text-gray-500">
          {is_mine === true ? "YOU" : message.sender.fullname}:
        </span>
      </header>
      <main>
        {message.is_deleted === true && message.content === null && (
          <p className="text-gray-200 text-sm">Message deleted</p>
        )}

        {message.is_deleted === false && message.content !== null && (
          <p className="text-gray-200 text-sm">{message.content}</p>
        )}
      </main>
    </div>
  );
}
