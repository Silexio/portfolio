"use client";

import { useSyncExternalStore } from "react";
import type { PackageId } from "@/lib/data";

const STORAGE_KEY = "silex_packages";
const EMPTY: PackageId[] = [];

let selected: PackageId[] | null = null;
const listeners = new Set<() => void>();

function load(): PackageId[] {
  if (selected === null) {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      selected = Array.isArray(saved) ? (saved.filter((id) => typeof id === "string") as PackageId[]) : [];
    } catch {
      selected = [];
    }
  }
  return selected;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function togglePackage(id: PackageId) {
  const current = load();
  selected = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  } catch {}
  listeners.forEach((notify) => notify());
}

/** Package ids the visitor added to their selection, persisted across the session. */
export function useSelectedPackages(): PackageId[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
