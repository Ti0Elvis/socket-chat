"use server";
import { API_URL } from "@/lib/constants";
import { Message } from "@/types/message";

export async function find_all_messages_by_room_id(room_id: string) {
  try {
    const response = await fetch(
      new URL(`/message/find-all-by-room/${room_id}`, API_URL),
      {}
    );

    const data = await response.json();

    if (response.ok === false) {
      return { error: data.message };
    }

    return { data: data as Array<Message> };
  } catch (error) {
    console.error(error);

    return { error: "Error fetching rooms" };
  }
}
