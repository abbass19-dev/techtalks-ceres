export type CardItem = {
  id: string;
  title: string;
  category: string;
  calories: number;
  protein: number;
  time: string;
  minutes: number;
  image: string;
};
export type NavbarUser = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type ScheduleState = Record<string, string[]>;
