import { UserNotification } from "../../lib/models/user-notification.model";
import { User } from "../../lib/models/user.model";

export const fetchUserProfile = async (
  userId: string
): Promise<Partial<User>> => {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error fetching user profile");
  const data = await response.json();
  return data.user;
};

export const updateUserProfile = async ({
  name,
  password,
}: {
  name: string;
  password: string;
}) => {
  const response = await fetch(`/api/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      password: password?.trim().length === 0 ? null : password,
    }),
  });

  if (!response.ok) throw new Error("Error updating profile");
  return response.json();
};

export const fetchNotifications = async (
  userId: string
): Promise<{ notifications: UserNotification[] }> => {
  const response = await fetch(`/api/users/${userId}/notifications`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error fetching user notifications");
  return (await response.json()) as { notifications: UserNotification[] };
};

export const dismissNotifications = async (userId: string): Promise<void> => {
  const response = await fetch(`/api/users/${userId}/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Error dismissing notifications");
};
