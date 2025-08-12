export interface User {
  _id?: string;
  clerk_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  image_url?: string | null;
  email_address?: string | undefined;
}

export interface Room {
  _id?: string;
  name?: string;
  clerk_id?: string;
  language?: string;
  owner?: User;
  users?: Array<User>;
  tag?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
