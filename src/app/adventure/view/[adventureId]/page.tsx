"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Adventure } from "../../../../lib/models/adventure.model";
import { AdventureService } from "../../../services/adventure-service";

export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  useEffect(() => {
    fetchAdventureById();
  }, []);

  const fetchAdventureById = async () => {
    try {
      const result = await AdventureService.getAdventureById(
        params.adventureId
      );

      setAdventure(result);
    } catch (error) {
      // TODO: Redirect to an error page?
      console.error(error);
    }
  };

  // This is a placeholder to get basic functionality working
  return (
    <div>
      <h1>View edit an adventure with id {params.adventureId}</h1>
      <h1>{adventure?.description}</h1>
    </div>
  );
}
