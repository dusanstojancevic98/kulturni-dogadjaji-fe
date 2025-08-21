import { featureFlags } from "@src/config/featureFlags";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import type { Review } from "@src/models/review.types";
import { addReview, deleteReview, getReviews } from "@src/services/review.api";
import { store as reduxStore } from "@src/store/redux/store";
import { reviewsActions } from "../redux/slices/reviews.slice";
import { reviewsStore } from "../zustand/reviews.store";

export const reviewsController = {
  getReviews: (eventId: string): Review[] => {
    if (featureFlags.useRedux) {
      return reduxStore.getState().reviews.byEvent[eventId] ?? [];
    }
    return reviewsStore.getState().byEvent[eventId] ?? [];
  },

  loadReviews: async (eventId: string) => {
    if (!eventId) return;
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        reviewsActions.setLoading({ eventId, loading: true })
      );
      try {
        const list = await getReviews(eventId);
        reduxStore.dispatch(
          reviewsActions.setReviews({ eventId, reviews: list })
        );
        reduxStore.dispatch(reviewsActions.setError({ eventId, error: null }));
      } catch {
        reduxStore.dispatch(
          reviewsActions.setError({ eventId, error: "Greška" })
        );
      } finally {
        reduxStore.dispatch(
          reviewsActions.setLoading({ eventId, loading: false })
        );
      }
    } else {
      const state = reviewsStore.getState();
      state.setLoading(eventId, true);
      try {
        const list = await getReviews(eventId);
        state.setReviews(eventId, list);
        state.setError(eventId, null);
      } catch {
        state.setError(eventId, "Greška");
      } finally {
        state.setLoading(eventId, false);
      }
    }
  },

  addOrUpdate: async (eventId: string, rating: number, comment?: string) => {
    const rev = await addReview(eventId, rating, comment);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(
        reviewsActions.upsertReview({ eventId, review: rev })
      );
    } else {
      reviewsStore.getState().upsertReview(eventId, rev);
    }
    return rev;
  },

  remove: async (eventId: string, reviewId: string) => {
    await deleteReview(reviewId);
    if (featureFlags.useRedux) {
      reduxStore.dispatch(reviewsActions.removeReview({ eventId, reviewId }));
    } else {
      reviewsStore.getState().removeReview(eventId, reviewId);
    }
  },
};

export const useReviews = (eventId: string = "") => {
  const redux = useAppSelector((state) => state.reviews.byEvent[eventId] ?? []);
  const zustand = reviewsStore().byEvent[eventId] ?? [];
  return featureFlags.useRedux ? redux : zustand;
};
