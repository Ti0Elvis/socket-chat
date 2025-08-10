"use server";
import z from "zod";
import type { Room } from "@/types/api";
import { schema } from "@/components/create-room";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_all_rooms() {
  try {
    const token = await (await auth()).getToken();

    const response = await axios_instance.get<Array<Room>>("/room/find-all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { rooms: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}

export async function create_room(values: z.infer<typeof schema>) {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", status: 500 };
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

export async function join_to_room(_id: string | undefined) {
  try {
    if (_id === undefined) {
      return { error: "Invalid _id", status: 500 };
    }

    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", status: 500 };
    }

    const token = await (await auth()).getToken();

    const response = await axios_instance.patch<string>(
      `/room/join?user_id=${user.id}&&room_id=${_id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}

export async function delete_room(_id: string | undefined) {
  try {
    if (_id === undefined) {
      return { error: "Invalid _id", status: 500 };
    }

    const token = await (await auth()).getToken();

    const response = await axios_instance.delete<string>(
      `/room/delete/${_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}
