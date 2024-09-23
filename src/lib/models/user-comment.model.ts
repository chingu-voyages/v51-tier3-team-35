export type UserComment = {
  _id?: string;
  text: string;
  createdAt: Date;
  createdBy: string;
  adventureId: string;
  occurrenceId: string;
};
