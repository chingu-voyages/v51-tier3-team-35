'use client'
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavBar(){
  const { data: session, status } = useSession();

    return (
        <nav className="navbar bg-base-100 shadow-md">
          <div className="container mx-auto flex justify-between items-center">

            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Adventure Canvas
              </Link>
            </div>
            {status === "authenticated" ? 
              <div className="flex space-x-4">
                <Link href="/adventure/new" className="btn btn-primary">
                  Start New Canvas
                </Link>
                <Link href={`users/${session?.user?._id}`} className="btn btn-outline">
                  My Profile
                </Link>
              </div> : 
              <div className="flex space-x-4">
                <Link href="/signin" className="btn btn-outline">
                  Sign In
                </Link>
              </div>}
  
          </div>
        </nav>
      );
}