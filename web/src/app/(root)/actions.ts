"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function find_user_by_clerk() {
  try {
    const user = await currentUser();

    if (user === null) {
      return { error: "Invalid user", status: 500 };
    }

    const token = await (await auth()).getToken();

    const response = await axios_instance.get(
      `/user/find-by-clerkId/${user.id}`,
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
