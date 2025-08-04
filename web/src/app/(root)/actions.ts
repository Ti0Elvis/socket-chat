"use server";
import { currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_user_on_nestjs_api() {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("Invalid user");
    }

    const response = await axios_instance.get(
      `/user/find-by-clerkId/${user.id}`
    );

    return { data: response.data, status: response.status };
  } catch (error) {
    const e = new CustomAxiosError(error);

    return { error: e.message, status: e.status };
  }
}
