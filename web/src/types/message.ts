export interface Message {
  _id: string;
  content: string | null;
  sender: {
    img_url: string;
    clerk_id: string;
    fullname: string;
  };
  room_id: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
