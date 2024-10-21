import { signIn } from "next-auth/react";
export const AuthService = {
  signUpUser: async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      throw new Error("Failed to sign up");
    }
  },
  signInCredentials: async ({
    email,
    password,
    callbackUrl,
    redirect = true,
  }: {
    email: string;
    password: string;
    callbackUrl?: string;
    redirect?: boolean;
  }): Promise<{ status: "success" | "fail"; message?: string }> => {
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect,
    });

    if (!res?.ok) {
      return {
        status: "fail",
        message: "Unable to sign in: please check your credentials.",
      };
    }
    return { status: "success" };
  },
  signInGoogle: async (callbackUrl: string = "/home") => {
    await signIn("google", {
      redirect: true,
      callbackUrl: callbackUrl,
    });
  },
};
