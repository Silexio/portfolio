"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  closeBooking,
  useBookingModalOpen,
  useBookingSession,
} from "@/hooks/useBookingModal";
import type { BookingLabels } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

/* Calendrier, formulaire et Turnstile ne servent qu'après un clic : les monter au chargement,
   c'est payer leur hydratation sur chaque visite. `session` ne s'incrémente qu'à l'ouverture et ne
   redescend jamais — une fois montée, la modale le reste, y compris pendant sa fermeture animée. */
const BookingClient = dynamic(() =>
  import("@/components/sections/BookingClient").then((m) => m.BookingClient),
);

type BookingModalProps = {
  lang: Locale;
  siteKey: string;
  labels: BookingLabels;
  closeLabel: string;
};

export function BookingModal({
  lang,
  siteKey,
  labels,
  closeLabel,
}: BookingModalProps) {
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
      <div className="booking-modal__inner">
        <div className="booking-modal__head">
          <h2
            id="booking-modal-title"
            className="subtitle booking-modal__title"
          >
            {labels.title}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={closeBooking}
            aria-label={closeLabel}
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="booking-modal__tz">{labels.tzNote}</p>
        {session > 0 && (
          <BookingClient
            key={session}
            lang={lang}
            siteKey={siteKey}
            active={open}
            labels={labels}
          />
        )}
      </div>
    </dialog>
  );
}
