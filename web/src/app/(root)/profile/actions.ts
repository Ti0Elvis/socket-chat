"use server";
import { clerkClient } from "@clerk/nextjs/server";

export async function delete_account(id: string | undefined) {
  try {
    if (id === undefined) {
      return { error: "The id of the user cannot be undefined" };
    }

    const client = await clerkClient();

    await client.users.deleteUser(id);

    return { message: "User deleted successfully", error: undefined };
  } catch (error) {
    console.error(error);
    return { message: undefined, error: "Internal server error" };
  }
}
