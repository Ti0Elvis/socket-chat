"use server";
import type { Action } from "@/types/actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function is_registered_current_user_on_api(): Action<boolean> {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", ok: false };
    }

    const client = await auth();
    const token = await client.getToken();

    const response = await axios_instance.get<boolean>(
      `/user/is-registered/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { data: response.data, ok: true };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, ok: false };
  }
}
