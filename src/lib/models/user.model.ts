import { UserNotification } from "./user-notification.model";

export type User = {
  _id?: string;
  name: string;
  oAuth: boolean;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  notifications: UserNotification[];
  avatarUrl?: string;
};
