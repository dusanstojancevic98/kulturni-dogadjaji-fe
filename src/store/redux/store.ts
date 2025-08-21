import { configureStore } from "@reduxjs/toolkit";
import { adminUsersReducer } from "./slices/adminUsers.slice";
import { authReducer } from "./slices/auth.slice";
import { eventsReducer } from "./slices/events.slice";
import { favoritesReducer } from "./slices/favorites.slice";
import { institutionsReducer } from "./slices/institutions.slice";
import { profileReducer } from "./slices/profile.slice";
import { ratingReducer } from "./slices/rating.slice";
import { reservationsReducer } from "./slices/reservations.slice";
import { reviewsReducer } from "./slices/reviews.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reviews: reviewsReducer,
    rating: ratingReducer,
    adminUsers: adminUsersReducer,
    events: eventsReducer,
    favorites: favoritesReducer,
    reservations: reservationsReducer,
    institutions: institutionsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
