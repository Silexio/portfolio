"use client";

import { useEffect, useRef } from "react";
import { BookingClient } from "@/components/sections/BookingClient";
import { closeBooking, useBookingModalOpen, useBookingSession } from "@/hooks/useBookingModal";
import type { BookingLabels, PackageId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

type BookingModalProps = {
  lang: Locale;
  siteKey: string;
  labels: BookingLabels;
  packageLabels: Record<PackageId, string>;
  closeLabel: string;
};

export function BookingModal({ lang, siteKey, labels, packageLabels, closeLabel }: BookingModalProps) {
  const open = useBookingModalOpen();
  const session = useBookingSession();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => closeBooking();
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="booking-modal"
      tabIndex={-1}
      aria-labelledby="booking-modal-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) closeBooking();
      }}
    >
      <button type="button" className="booking-modal__close" onClick={closeBooking} aria-label={closeLabel}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="booking-modal__inner">
        <h2 id="booking-modal-title" className="booking-modal__title">
          {labels.title}
        </h2>
        <p className="booking-modal__tz">{labels.tzNote}</p>
        <BookingClient key={session} lang={lang} siteKey={siteKey} active={open} labels={labels} packageLabels={packageLabels} />
      </div>
    </dialog>
  );
}
