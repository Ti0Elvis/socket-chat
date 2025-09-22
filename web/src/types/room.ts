export interface Room {
  _id?: string;
  name: string;
  language: string;
  owner: string;
  tag: string;
  createdAt?: Date;
  updatedAt?: Date;
}
