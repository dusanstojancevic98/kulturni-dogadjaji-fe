export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  EVENTS: "/events",
  EVENT_DETAIL: (id = ":id") => `/events/${id}`,
  EVENT_CREATE: "/events/new",
  NOT_FOUND: "*",
  EVENT_EDIT: (id = ":id") => `/events/${id}/edit`,
};
