"use server";
import { API_URL } from "@/lib/constants";

export async function find_room_by_id(room_id: string) {
  try {
    const response = await fetch(
      new URL(`/room/find-by-id/${room_id}`, API_URL)
    );

    const data = await response.json();

    if (response.ok === false) {
      return { error: data.message };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred" };
  }
}
