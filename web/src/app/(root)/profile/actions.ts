"use server";
import { _axios } from "@/providers/axios";
import { clerkClient } from "@clerk/nextjs/server";
import { CustomAxiosError } from "@/lib/custom-axios-error";

export async function delete_account(id: string | undefined) {
  try {
    if (id === undefined) {
      return { error: "The id of the user cannot be undefined" };
    }

    const client = await clerkClient();

    await client.users.deleteUser(id);

    const response = await _axios.delete(`/user/delete/${id}`);

    return { message: response.data, error: undefined };
  } catch (error) {
    const custom_error = new CustomAxiosError(error);

    console.error(error, { message: custom_error.message });

    return {
      message: undefined,
      error: custom_error.message ?? "Unexpected error occurred",
    };
  }
}
