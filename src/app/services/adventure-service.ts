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
    const responseBody = await res.json();
    if (res.ok) {
      return responseBody;
    }

    if ("error" in responseBody) {
      throw new Error(responseBody.error);
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

  async patchAdventureById(
    id: string,
    { description, name, startDate, endDate }: Partial<Adventure>
  ): Promise<void> {
    const res = await fetch(`/api/adventure/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, name, startDate, endDate }),
    });
    if (!res.ok) {
      throw new Error("Failed to update adventure");
    }
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
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          notes: data.notes,
          data,
          eventType,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to update occurrence");
    }
  },
  putComment: async (
    adventureId: string,
    occurrenceId: string,
    text: string
  ): Promise<void> => {
    const res = await fetch(
      `/api/adventure/${adventureId}/occurrence/${occurrenceId}/comment`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to add comment");
    }
  },
  getUserNamesByIds: async (
    userIds: string[]
  ): Promise<Record<string, string>> => {
    // This function accepts an array of user ids and returns a dictionary of user ids to user names

    const mappedUserIds = userIds.map((id) => `userIds=${id}`).join("&");
    const res = await fetch(`/api/users/names?${mappedUserIds}`);
    if (res.ok) {
      const { users } = await res.json();
      return users;
    }
    throw new Error("Failed to fetch user names");
  },
  deleteOccurrenceById: async (adventureId: string, currentEventId: string) => {
    const res = await fetch(
      `/api/adventure/${adventureId}/occurrence/${currentEventId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to delete occurrence");
    }
  },
  addUserToAdventure: async (
    adventureId: string,
    email: string
  ): Promise<void> => {
    const res = await fetch(`/api/adventure/${adventureId}/participants`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      throw new Error("Failed to add user to adventure");
    }
  },
};
