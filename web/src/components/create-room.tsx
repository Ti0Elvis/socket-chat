"use client";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { languages } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { create_room } from "@/app/(root)/rooms/actions";
import { CheckIcon, ListChevronsUpDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const schema = z.object({
  name: z.string().min(1, { message: "Please insert a name for the room" }),
  language: z.string(),
  tag: z
    .string()
    .min(1, { message: "Please insert a tag for the room" })
    .max(24),
});

export function CreateRoom() {
  const [dialog, setDialog] = useState(false);
  const [popover, setPopover] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      tag: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationKey: ["create-room"],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const response = await create_room(values);

      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: (room) => {
      setDialog(false);
      router.push(`/rooms/${room._id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  useEffect(() => {
    if (dialog === false) {
      form.reset();
    }
  }, [dialog, form]);

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Room Form</DialogTitle>
          <DialogDescription>
            Start a room to chat with others users
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Write a name for the room"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Language</FormLabel>
                  <Popover open={popover} onOpenChange={setPopover}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <ListChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search language..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("language", language.value);
                                  setPopover(false);
                                }}
                              >
                                {language.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the language that will be used in the chat room
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Write a tag for the room"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end">
              <Button disabled={mutation.isPending}>
                {mutation.isPending === true ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
