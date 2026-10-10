"use client";

import type { ReactNode } from "react";
import { Btn, type BtnVariant } from "@/components/ui/Btn";
import type { IconName } from "@/components/ui/Icon";
import { openBooking } from "@/hooks/useBookingModal";

type BookingButtonProps = {
  children: ReactNode;
  variant?: BtnVariant;
  icon?: IconName;
};

/** Ouvre la modale de réservation : le seul îlot client dont un CTA d'appel a besoin dans un composant serveur. */
export function BookingButton({
  children,
  variant,
  icon = "calendar",
}: BookingButtonProps) {
  return (
    <Btn onClick={openBooking} variant={variant} icon={icon}>
      {children}
    </Btn>
  );
}
