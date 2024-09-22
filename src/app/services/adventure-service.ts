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
};
