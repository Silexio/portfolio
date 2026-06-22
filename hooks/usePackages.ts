"use client";

import { useSyncExternalStore } from "react";
import type { PackageId } from "@/lib/data";

let selected: PackageId[] = [];
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function togglePackage(id: PackageId) {
  selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  for (const notify of listeners) notify();
}

/** Package ids the visitor added — in-memory only, so a return visit starts fresh. */
export function useSelectedPackages(): PackageId[] {
  return useSyncExternalStore(
    subscribe,
    () => selected,
    () => selected,
  );
}
