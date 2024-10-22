"use client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Adventure } from "../../lib/models/adventure.model";
import { AdventureService } from "../services/adventure-service";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAdventures, setUserAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nameMap, setNameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAdventuresByUser();
  }, [userAdventures.length, Object.keys(nameMap).length]);

  const fetchAdventuresByUser = async () => {
    try {
      setIsLoading(true);
      const result = await AdventureService.getAdventuresByUser();
      setUserAdventures(result);

      // We need to get the names
      const adventureIds = result.map((adventure) => adventure.createdBy);
      if (adventureIds && adventureIds.length > 0) {
        const userNameMap = await AdventureService.getUserNamesByIds(
          adventureIds as string[]
        );
        setNameMap(userNameMap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
      </header>
      {/* Adventure list goes here */}
      <div className="mt-8">
        <header>
          <h2 className="text-2xl font-bold">Your Adventures</h2>
        </header>
        <div>
          <table className="table">
            <tbody>
              {userAdventures.map((adventure) => (
                <tr key={adventure._id}>
                  <td>
                    <div className="flex justify-between opacity-75 hover:opacity-100">
                      <Link
                        href={`/adventure/view/${adventure._id}`}
                        aria-disabled={isLoading}
                        onClick={() => {
                          setIsLoading(true);
                        }}
                        className={` w-full ${
                          isLoading ? "disabled pointer-events-none" : ""
                        }`}
                      >
                        <h3 className="text-lg font-bold">{adventure.name} </h3>
                        <p>{adventure.description}</p>
                        <p>
                          Created by <b>{nameMap[adventure.createdBy]}</b> {""}
                          on {dayjs(adventure.createdAt).format(
                            "YYYY-MMM-DD"
                          )}{" "}
                        </p>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}
