"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Adventure } from "../../lib/models/adventure.model";
import { AdventureService } from "../services/adventure-service";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAdventures, setUserAdventures] = useState<Adventure[]>([]);

  useEffect(() => {
    fetchAdventuresByUser();
  }, []);

  const fetchAdventuresByUser = async () => {
    try {
      const result = await AdventureService.getAdventuresByUser();
      setUserAdventures(result);
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "unauthenticated") {
    // Only authenticated users can access this page
    router.replace("/signin");
    return null;
  }

  return (
    <div>
      <header>
        <div className="flex">
          {/* TODO: show user avatar here  */}
          <h1 className="text-4xl"> Welcome, {session?.user?.name}</h1>
        </div>
        <div>
          {/* New adventure button */}
          <Link href="/adventure/new">
            <button className="btn btn-primary">
              <div className="flex">
                <IoMdAdd />
                New Adventure
              </div>
            </button>
          </Link>
        </div>
      </header>
      {/* Adventure list goes here */}
      <div>
        <header>
          <h2 className="text-2xl">Your Adventures</h2>
        </header>
        <div>
          <table className="table">
            <tbody>
              {userAdventures.map((adventure) => (
                <tr key={adventure._id}>
                  <td>
                    <h3>{adventure.name}</h3>
                    <p>{adventure.description}</p>
                  </td>
                  <td>
                    <Link href={`/adventure/view/${adventure._id}`}>
                      <button className="btn btn-secondary">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
