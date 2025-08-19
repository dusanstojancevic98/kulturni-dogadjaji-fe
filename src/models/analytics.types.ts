export type AnalyticsOverview = {
  users: number;
  events: number;
  reservations: number;
  favorites: number;
};

export type MyStats = {
  events: number;
  reservations: number;
  favorites: number;
};

export type MyEventStat = {
  id: string;
  title: string;
  dateTime: string;
  capacity: number;
  _count: {
    reservations: number;
    favorites: number;
  };
};
