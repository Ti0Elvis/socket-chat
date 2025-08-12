"use server";
import type { Action } from "@/types/actions";
import { axios_instance, CustomAxiosError } from "@/lib/axios";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export async function delete_current_user(): Action<string> {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", ok: false };
    }

    const _auth = await auth();
    const token = await _auth.getToken();

    // Delete user on api
    const response = await axios_instance.delete<string>(
      `/user/delete/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      }
    );

    // Delete clerk account
    const client = await clerkClient();
    await client.users.deleteUser(user.id);

    return { data: response.data, ok: true };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, ok: false };
  }
}
