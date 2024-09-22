import { Adventure } from "../../lib/models/adventure.model";

/**
 * Fetching adventures for the authenticated user
 */
export const AdventureService = {
  async getAdventuresByUser(): Promise<Adventure[]> {
    const res = await fetch("/api/adventure");
    if (res.ok) {
      return await res.json();
    }
    throw new Error("Failed to fetch adventures");
  },
  async postCreateAdventure({
    name,
    description,
    startDate,
    endDate,
  }: {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<{ id: string }> {
    const res = await fetch("/api/adventure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        startDate,
        endDate,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error("Failed to create adventure");
  },
};
