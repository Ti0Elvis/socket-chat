"use server";
import z from "zod";
import { Room } from "@/types/room";
import { API_URL } from "@/lib/constants";
import { schema } from "@/components/create-room";
import { currentUser } from "@clerk/nextjs/server";

export async function create_room(values: z.infer<typeof schema>) {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user" };
    }

    const payload = { clerk_id: user.id, ...values };

    const response = await fetch(new URL("/room/create", API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok === false) {
      return { error: data.message };
    }

    return { data };
  } catch (error) {
    console.error(error);

    return { error: "Error creating room" };
  }
}

export async function find_all_rooms(page: number) {
  try {
    const response = await fetch(
      new URL(`/room/find-all/${page}`, API_URL),
      {}
    );

    const data = await response.json();

    if (response.ok === false) {
      return { error: data.message };
    }

    return { data: data as Array<Room> };
  } catch (error) {
    console.error(error);

    return { error: "Error fetching rooms" };
  }
}

export async function delete_room(_id: string | undefined, owner: string) {
  try {
    if (_id === undefined) {
      return { error: "Invalid _id" };
    }

    const response = await fetch(
      new URL(`/room/delete-by-id/${_id}/${owner}`, API_URL),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      }
    );

    if (response.ok === false) {
      const data = await response.json();

      return { error: data.message };
    }

    return { data: await response.text() };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting room" };
  }
}
