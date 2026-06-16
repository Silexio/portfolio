"use client";

import { formatDayLabel, formatTimeLabel } from "@/lib/booking/format";
import type { Locale } from "@/lib/i18n/config";

export type CalendarDay = { day: string; slots: { start: string; available: boolean }[] };

type BookingCalendarProps = {
  days: CalendarDay[];
  lang: Locale;
  activeDay: number;
  selectedSlot: string | null;
  onDayChange: (index: number) => void;
  onSelect: (start: string) => void;
  labels: { pickDay: string; pickSlot: string; noSlots: string };
};

export function BookingCalendar({
  days,
  lang,
  activeDay,
  selectedSlot,
  onDayChange,
  onSelect,
  labels,
}: BookingCalendarProps) {
  const current = days[activeDay];
  const hasFree = current?.slots.some((slot) => slot.available);

  return (
    <div className="booking-cal">
      <div className="booking-cal__days" role="tablist" aria-label={labels.pickDay}>
        {days.map((day, index) => (
          <button
            key={day.day}
            type="button"
            role="tab"
            aria-selected={index === activeDay}
            className="booking-cal__day"
            data-active={index === activeDay}
            onClick={() => onDayChange(index)}
          >
            {formatDayLabel(day.slots[0].start, lang)}
          </button>
        ))}
      </div>

      <div className="booking-cal__slots" role="group" aria-label={labels.pickSlot}>
        {current && hasFree ? (
          current.slots.map((slot) => (
            <button
              key={slot.start}
              type="button"
              className="booking-cal__slot"
              data-selected={slot.start === selectedSlot}
              aria-pressed={slot.start === selectedSlot}
              disabled={!slot.available}
              onClick={() => onSelect(slot.start)}
            >
              {formatTimeLabel(slot.start, lang)}
            </button>
          ))
        ) : (
          <p className="booking-cal__empty">{labels.noSlots}</p>
        )}
      </div>
    </div>
  );
}
