"use client";
import z from "zod";
import { useContext } from "react";
import { Button } from "./ui/button";
import { CardFooter } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSocketContext } from "@/context/socket-message";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

export const schema = z.object({
  content: z
    .string()
    .min(1, "Content message must be have at least one character")
    .trim()
    .transform((val) => val.replace(/\s+/g, " ")),
});

interface Props {
  room_id: string;
}

export function SendMessage({ room_id }: Readonly<Props>) {
  const { user } = useUser();
  const context = useContext(MessageSocketContext)!;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationKey: ["send-message"],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const payload = {
        content: values.content,
        sender: {
          clerk_id: user?.id,
          fullname: user?.fullName || user?.username || "Unknown",
        },
        room_id,
      };

      form.reset();
      context.socket?.emit("send-message", payload);
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <CardFooter>
      <Form {...form}>
        <form
          className="w-full h-full flex flex-col md:flex-row justify-between gap-2"
          onSubmit={onSubmit}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      className="resize-none w-full"
                      placeholder="Write a message to send it"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button className="w-full h-auto md:w-auto md:h-16 md:rounded-full">
            Send
          </Button>
        </form>
      </Form>
    </CardFooter>
  );
}
