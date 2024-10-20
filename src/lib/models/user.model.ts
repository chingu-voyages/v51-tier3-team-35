export type User = {
  _id?: string;
  name: string;
  oAuth: boolean;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  notifications: string[];
  avatarUrl?: string;
};
