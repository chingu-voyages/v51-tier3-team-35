"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
export default function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <nav className="bg-base-100 shadow-md flex justify-between w-full p-4">
      <div className="flex justify-between w-full">
        <div className="self-center">
          <Link href="/" className="text-2xl font-bold">
            TravelIt ✈️
          </Link>
        </div>
        {status === "authenticated" && (
          <div className="flex space-x-4">
            <Link href="/adventure/new" className="btn btn-primary">
              New Adventure
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-btn"
              >
                <RxAvatar size="32px" />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
              >
                <li>
                  <Link href={`/users/${session?.user?._id}`}>My Profile</Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut();
                      router.replace("/signin");
                    }}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
