"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function delete_account(id: string | undefined) {
  try {
    if (id === undefined) {
      throw new Error("The id of the user cannot be undefined");
    }

    // Delete clerk account
    const client = await clerkClient();
    await client.users.deleteUser(id);

    // Delete nestjs user
    const response = await axios_instance.delete<string>(
      `/user/delete-by-clerkId/${id}`
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}
