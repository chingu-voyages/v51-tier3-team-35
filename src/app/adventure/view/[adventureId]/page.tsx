"use client";
import { useParams } from "next/navigation";

export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  // /adventure/[adventureId]
  return (
    <div>
      <h1>View edit an adventure with id {params.adventureId}</h1>
    </div>
  );
}
