"use client";

import { useSyncExternalStore } from "react";

let open = false;
let session = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const notify of listeners) notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openBooking() {
  open = true;
  session += 1;
  emit();
}

export function closeBooking() {
  open = false;
  emit();
}

/** Whether the booking modal is currently open (shared store, no Provider). */
export function useBookingModalOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}

/** Increments on each open — used as a remount key so the form resets fresh each time. */
export function useBookingSession(): number {
  return useSyncExternalStore(
    subscribe,
    () => session,
    () => 0,
  );
}
