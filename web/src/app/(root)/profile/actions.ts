"use server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export async function delete_my_own_account() {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("Invalid user");
    }

    const token = await (await auth()).getToken();

    // Delete clerk account
    const client = await clerkClient();
    await client.users.deleteUser(user.id);

    // Delete nestjs user
    const response = await axios_instance.delete<string>(
      `/user/delete-by-clerkId/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}
