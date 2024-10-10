import { Adventure } from "../../lib/models/adventure.model";
import { EventType, Occurrence } from "../../lib/models/occurrence.model";
import { OccurrenceApiWriteRequest } from "./definitions";

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

  async getAdventureById(id: string): Promise<Adventure> {
    const res = await fetch(`/api/adventure/${id}`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error("Failed to fetch adventure");
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

  async createOccurrence<T>({
    eventType,
    data,
    startDate,
    endDate,
    adventureId,
    notes,
    description,
    title,
  }: OccurrenceApiWriteRequest<T>): Promise<void> {
    const res = await fetch(`/api/adventure/${adventureId}/occurrence`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType,
        data,
        startDate,
        endDate,
        adventureId,
        notes,
        description,
        title,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update adventure");
    }
  },
  getOccurrenceById: async (
    adventureId: string,
    occurrenceId: string
  ): Promise<Occurrence> => {
    const res = await fetch(
      `/api/adventure/${adventureId}/occurrence/${occurrenceId}`
    );
    if (res.ok) {
      return await res.json();
    }
    throw new Error("Failed to fetch occurrence");
  },
  patchOccurrenceById: async (
    adventureId: string,
    occurrenceId: string,
    eventType: EventType,
    data: Partial<Occurrence>
  ): Promise<void> => {
    const res = await fetch(
      `/api/adventure/${adventureId}/occurrence/${occurrenceId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, eventType }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to update occurrence");
    }
  },
};
