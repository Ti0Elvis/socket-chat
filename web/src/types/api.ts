export interface Clerk {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string | null;
  emailAddress: string | undefined;
}

export interface User {
  _id: string;
  clerk: Clerk;
}

export interface Room {
  _id: string;
  name: string;
  language: string;
  owner: User;
  users: Array<User>;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}
