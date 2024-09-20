"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status !== "authenticated") {
    // Only authenticated users can access this page
    router.replace("/signin");
    return null;
  }

  /* This is just placeholder */

  return (
    <div>
      <h1> Home Page</h1>
      <p> Welcome to the home page, {session?.user?.name}</p>
    </div>
  );
}
