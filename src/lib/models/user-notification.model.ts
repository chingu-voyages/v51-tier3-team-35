export type UserNotification = {
  _id?: string;
  sourceUser: {
    id: string;
    name: string;
  };
  targetUser: {
    id: string;
    name: string;
  };
  link?: {
    href: string;
    label: string;
  };
  notificationType: NotificationType;
  messageBody?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NotificationType = "addToAdventure" | "comment";
