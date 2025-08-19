export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "*",
  EVENTS: "/events",
  EVENT_DETAIL: (id = ":id") => `/events/${id}`,
  EVENT_CREATE: "/events/create",
  EVENT_EDIT: (id = ":id") => `/events/${id}/edit`,

  INSTITUTIONS: "/institutions",
  INSTITUTION_CREATE: "/institutions/create",
  INSTITUTION_DETAIL: (id = ":id") => `/institutions/${id}`,
  INSTITUTION_EDIT: (id = ":id") => `/institutions/${id}/edit`,

  MY_EVENTS: "/my-events",
  MY_RESERVATIONS: "/me/reservations",
  MY_FAVORITES: "/me/favorites",
  PROFILE: "/me/profile",

  ADMIN_USERS: "/admin/users",

  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/events",
};
