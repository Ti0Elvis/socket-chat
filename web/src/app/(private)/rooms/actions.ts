"use server";
import z from "zod";
import type { Room } from "@/types/api";
import type { Action } from "@/types/actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { schema } from "./components/create-room-button";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_all_rooms(): Action<Array<Room>> {
  try {
    const client = await auth();
    const token = await client.getToken();

    const response = await axios_instance.get<Array<Room>>("/room/find-all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data, ok: true };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, ok: false };
  }
}

export async function create_room(
  values: z.infer<typeof schema>
): Action<Room> {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", ok: false };
    }

    const client = await auth();
    const token = await client.getToken();

    const payload: Room = {
      clerk_id: user.id,
      name: values.name,
      language: values.language,
      tag: values.tag,
    };

    const response = await axios_instance.post<Room>("/room/create", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: response.data, ok: true };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, ok: false };
  }
}

export async function delete_room(_id: string | undefined): Action<string> {
  try {
    if (_id === undefined) {
      return { error: "Invalid _id", ok: false };
    }

    const client = await auth();
    const token = await client.getToken();

    const response = await axios_instance.delete<string>(
      `/room/delete/${_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {},
      }
    );

    return { data: response.data, ok: true };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, ok: false };
  }
}
