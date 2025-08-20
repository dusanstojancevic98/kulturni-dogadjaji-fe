import type { EventRating } from "@src/models/event.types";
import { getEventRating } from "@src/services/events.api";
import { useEffect, useState } from "react";

const cache = new Map<string, EventRating>();

export const useEventRating = (eventId?: string) => {
  const [data, setData] = useState<EventRating | null>(null);

  useEffect(() => {
    if (!eventId) return;
    if (cache.has(eventId)) {
      setData(cache.get(eventId)!);
      return;
    }
    let alive = true;
    getEventRating(eventId).then((r) => {
      if (!alive) return;
      cache.set(eventId, r);
      setData(r);
    });
    return () => {
      alive = false;
    };
  }, [eventId]);

  return data;
};
