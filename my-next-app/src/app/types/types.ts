export type ActivityType =
  | "education"
  | "recreational"
  | "social"
  | "diy"
  | "charity"
  | "cooking"
  | "relaxation"
  | "music"
  | "busywork";

export interface TodoItem {
  id: number;
  activity: string;
  price: number;
  type: ActivityType;
  bookingRequired: boolean;
  accessibility: number;
}
