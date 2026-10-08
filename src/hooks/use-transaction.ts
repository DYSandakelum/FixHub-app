import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useLocalSearchParams } from "expo-router";
import { type PaymentMethod } from "@/constants/transaction";
import * as repo from "@/lib/transaction-repository";

type Entry = {
  data: repo.TransactionData;
  loaded: boolean;
  saving?: boolean;
  listeners: Set<() => void>;
  pending?: Promise<void>;
};
const entries = new Map<string, Entry>();
function entryFor(id: string) {
  if (!entries.has(id))
    entries.set(id, {
      data: repo.initialTransaction(),
      loaded: false,
      listeners: new Set(),
    });
  return entries.get(id)!;
}
function notify(entry: Entry) {
  entry.listeners.forEach((fn) => fn());
}
function publish(id: string, data: repo.TransactionData) {
  const entry = entryFor(id);
  entry.data = data;
  entry.loaded = true;
  notify(entry);
}
function lock(id: string) {
  const entry = entryFor(id);
  if (entry.saving) return false;
  entry.saving = true;
  return true;
}
function unlock(id: string) {
  entryFor(id).saving = false;
}
async function reload(id: string) {
  const entry = entryFor(id);
  if (!entry.pending)
    entry.pending = repo
      .loadTransaction(id)
      .then((data) => publish(id, data))
      .finally(() => {
        entry.pending = undefined;
      });
  await entry.pending;
}

export function useTransaction() {
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const id =
    (Array.isArray(params.bookingId)
      ? params.bookingId[0]
      : params.bookingId) || repo.DEMO_ID;
  const entry = entryFor(id);
  const data = useSyncExternalStore(
    useCallback(
      (fn) => {
        entry.listeners.add(fn);
        return () => {
          entry.listeners.delete(fn);
        };
      },
      [entry],
    ),
    () => entry.data,
    () => entry.data,
  );
  const [loading, setLoading] = useState(!entry.loaded);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDemo = id === repo.DEMO_ID;
  const refresh = useCallback(async () => {
    try {
      await reload(id);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this booking.");
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (isDemo) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void repo
      .subscribeTransaction(
        id,
        () => {
          void refresh();
        },
        setError,
      )
      .then((fn) => {
        if (disposed) fn();
        else cleanup = fn;
      })
      .catch((e) => setError(e.message));
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [id, isDemo, refresh]);

  async function mutate(
    demoUpdate: (d: repo.TransactionData) => repo.TransactionData,
    remote: () => Promise<void>,
  ) {
    if (busy || loading || !entry.loaded || !lock(id)) return false;
    setBusy(true);
    setError(null);
    try {
      if (isDemo) {
        const next = demoUpdate(entry.data);
        await repo.saveDemo(next);
        publish(id, next);
      } else {
        await remote();
        publish(id, await repo.loadTransaction(id));
      }
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save your changes. Please try again.",
      );
      return false;
    } finally {
      unlock(id);
      setBusy(false);
    }
  }
  return {
    ...data,
    id,
    isDemo,
    loading,
    busy,
    error,
    refresh,
    ready: entry.loaded,
    route: (
      pathname: "/payment" | "/booking-tracking" | "/chat" | "/rate-review",
    ) => ({ pathname, params: { bookingId: id } }),
    pay: (method: PaymentMethod) =>
      mutate(
        (d) => ({ ...d, booking: { ...d.booking, paid: true } }),
        () => repo.recordPayment(id, method),
      ),
    send: (body: string) =>
      mutate(
        (d) => ({
          ...d,
          messages: [
            ...d.messages,
            {
              id: `message-${Date.now()}`,
              body,
              mine: true,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
        () => repo.createMessage(id, body),
      ),
    deleteMessage: (messageId: string) =>
      mutate(
        (d) => ({
          ...d,
          messages: d.messages.filter((m) => m.id !== messageId),
        }),
        () => repo.removeMessage(messageId),
      ),
    saveReview: (review: Omit<repo.Review, "id">) =>
      mutate(
        (d) => ({
          ...d,
          review: { id: d.review?.id ?? `review-${Date.now()}`, ...review },
        }),
        () => repo.upsertReview(id, review),
      ),
    deleteReview: () =>
      mutate(
        (d) => ({ ...d, review: null }),
        () => repo.removeReview(id),
      ),
    advanceDemo: () =>
      mutate(
        (d) => ({
          ...d,
          booking: { ...d.booking, status: repo.nextStage(d.booking.status) },
        }),
        async () => {
          throw new Error("Only the provider can update a real booking.");
        },
      ),
    reset: async () => {
      if (!isDemo || !lock(id)) return;
      try {
        publish(id, await repo.resetDemo());
      } catch {
        setError("Could not reset demo data.");
      } finally {
        unlock(id);
      }
    },
  };
}
