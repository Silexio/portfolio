"use client";

import {
  formatDayLabel,
  formatTimeLabel,
  slotPeriod,
} from "@/lib/booking/format";
import type { Locale } from "@/lib/i18n/config";

export type CalendarDay = {
  day: string;
  slots: { start: string; available: boolean }[];
};

const PERIODS = ["morning", "afternoon"] as const;

type BookingCalendarProps = {
  days: CalendarDay[];
  lang: Locale;
  activeDay: number;
  selectedSlot: string | null;
  onDayChange: (index: number) => void;
  onSelect: (start: string) => void;
  labels: {
    pickDay: string;
    pickSlot: string;
    noSlots: string;
    morning: string;
    afternoon: string;
  };
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
      <div
        className="booking-cal__days"
        role="group"
        aria-label={labels.pickDay}
      >
        {days.map((day, index) => (
          <button
            key={day.day}
            type="button"
            aria-pressed={index === activeDay}
            className="pill booking-cal__day"
            data-active={index === activeDay}
            onClick={() => onDayChange(index)}
          >
            {formatDayLabel(day.slots[0].start, lang)}
          </button>
        ))}
      </div>

      <div role="group" aria-label={labels.pickSlot}>
        {current && hasFree ? (
          PERIODS.map((period) => {
            const slots = current.slots.filter(
              (slot) => slotPeriod(slot.start) === period,
            );
            if (slots.length === 0) return null;
            return (
              <div
                key={period}
                className="booking-cal__period"
                role="group"
                aria-labelledby={`booking-cal-${period}`}
              >
                <p
                  id={`booking-cal-${period}`}
                  className="booking-cal__period-title"
                >
                  {labels[period]}
                </p>
                <div className="booking-cal__slots">
                  {slots.map((slot) => (
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
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="booking-cal__empty">{labels.noSlots}</p>
        )}
      </div>
    </div>
  );
}
