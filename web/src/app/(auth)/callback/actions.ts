"use server";
import type { UserClerk } from "@/types/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function ensure_user_registered() {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("Invalid user");
    }

    const token = await (await auth()).getToken();

    // Create user in nestjs API
    const payload: UserClerk = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      emailAddress: user.primaryEmailAddress?.emailAddress,
    };

    const response = await axios_instance.post<string>(
      "/user/ensure-user-registered",
      payload,
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
