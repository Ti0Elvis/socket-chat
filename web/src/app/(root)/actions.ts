"use server";
import { _axios } from "@/providers/axios";
import { currentUser } from "@clerk/nextjs/server";
import { CustomAxiosError } from "@/lib/custom-axios-error";

export async function is_user_registered_with_api() {
  try {
    const user = await currentUser();

    if (user === null) {
      return { message: undefined, error: "Invalid user" };
    }

    const response = await _axios.get(`/user/find-by-clerkId/${user.id}`);

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
