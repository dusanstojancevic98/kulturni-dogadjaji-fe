import type {
  AnalyticsOverview,
  MyEventStat,
  MyStats,
} from "@src/models/analytics.types";
import type { Event } from "@src/models/event.types";
import type { Institution } from "@src/models/institution.types";
import { api } from "@src/services/api";

export const getOverview = async (): Promise<AnalyticsOverview> => {
  const res = await api.get("/analytics/overview");
  return res.data as AnalyticsOverview;
};

export const getTopEvents = async (limit = 5): Promise<Event[]> => {
  const res = await api.get("/analytics/top-events", { params: { limit } });
  return res.data as Event[];
};

export const getTopInstitutions = async (limit = 5): Promise<Institution[]> => {
  const res = await api.get("/analytics/top-institutions", {
    params: { limit },
  });
  return res.data as Institution[];
};

export const getMyStats = async (): Promise<MyStats> => {
  const res = await api.get("/analytics/my/stats");
  return res.data as MyStats;
};

export const getMyEventsStats = async (limit = 10): Promise<MyEventStat[]> => {
  const res = await api.get("/analytics/my/events", { params: { limit } });
  return res.data as MyEventStat[];
};
