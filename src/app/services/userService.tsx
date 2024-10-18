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
