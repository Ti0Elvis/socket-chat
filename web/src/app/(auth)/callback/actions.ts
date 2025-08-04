"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { axios_instance, CustomAxiosError } from "@/lib/axios";

export async function register_user_on_nestjs_api() {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("Invalid user");
    }

    const token = await (await auth()).getToken();

    // Create user in nestjs API
    const response = await axios_instance.post<string>(
      "/user/register-if-not-exists",
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        emailAddress: user.primaryEmailAddress?.emailAddress,
      },
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
