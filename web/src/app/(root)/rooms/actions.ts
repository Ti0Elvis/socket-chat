"use server";
import z from "zod";
import type { Room } from "@/types/api";
import { schema } from "./components/create-room";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_all_rooms() {
  try {
    const token = await (await auth()).getToken();

    const response = await axios_instance.get<Array<Room>>("/room/find-all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}

export async function create_room(values: z.infer<typeof schema>) {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("Invalid user");
    }

    const token = await (await auth()).getToken();

    const response = await axios_instance.post<Room>(
      "/room/create",
      {
        user_id: user.id,
        ...values,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}
