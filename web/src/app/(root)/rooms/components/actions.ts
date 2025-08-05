"use server";
import z from "zod";
import { schema } from "./create-room";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_all_rooms() {
  try {
    const token = await (await auth()).getToken();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios_instance.get<Array<any>>("/room/find-all", {
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

    const response = await axios_instance.post(
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
