"use client";

import { Icon } from "@/components/ui/Icon";
import { useEffect, useRef, useState } from "react";
import {
  BookingCalendar,
  type CalendarDay,
} from "@/components/ui/BookingCalendar";
import { Btn } from "@/components/ui/Btn";
import { Honeypot } from "@/components/ui/Honeypot";
import { Notice } from "@/components/ui/Notice";
import { Turnstile } from "@/components/ui/Turnstile";
import { useDoneFocus } from "@/hooks/useDoneFocus";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { formatSlotLabel } from "@/lib/booking/format";
import type { MeetingMode } from "@/lib/booking/schema";
import type { BookingLabels } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

type BookingClientProps = {
  lang: Locale;
  siteKey: string;
  active: boolean;
  labels: BookingLabels;
};

type ErrorKey =
  | "errorGeneric"
  | "errorSlotTaken"
  | "errorRate"
  | "errorCaptcha"
  | "errorValidation";

const ERROR_BY_CODE: Record<string, ErrorKey> = {
  slot_taken: "errorSlotTaken",
  invalid_slot: "errorSlotTaken",
  rate_limit: "errorRate",
  captcha: "errorCaptcha",
  validation: "errorValidation",
};

export function BookingClient({
  lang,
  siteKey,
  active,
  labels,
}: BookingClientProps) {
  const [days, setDays] = useState<CalendarDay[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [meetingType, setMeetingType] = useState<MeetingMode>("video");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const fieldsRef = useRef<HTMLFieldSetElement>(null);
  const { status, errorKey, token, attempt, onToken, send } =
    useFormSubmit<ErrorKey>({
      url: "/api/bookings",
      errorByCode: ERROR_BY_CODE,
      genericError: "errorGeneric",
    });
  const doneRef = useDoneFocus(status === "success");

  useEffect(() => {
    if (!active) return;
    let alive = true;
    void (async () => {
      try {
        const res = await fetch("/api/availability");
        if (!res.ok) throw new Error("availability");
        const data = (await res.json()) as { days: CalendarDay[] };
        if (alive) setDays(data.days);
      } catch {
        if (alive) setLoadError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [active]);

  useEffect(() => {
    if (!slot || !fieldsRef.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    fieldsRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [slot]);

  const canSubmit =
    Boolean(slot) &&
    Boolean(token) &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    status !== "submitting";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    void send({
      slotStart: slot,
      name,
      email,
      phone,
      meetingType,
      message,
      company,
      locale: lang,
      turnstileToken: token,
    });
  };

  if (status === "success") {
    return (
      <div ref={doneRef} tabIndex={-1}>
        <Notice tone="success" title={labels.successTitle}>
          {labels.successBody}
        </Notice>
      </div>
    );
  }

  if (loadError) {
    return <Notice tone="error">{labels.slotsError}</Notice>;
  }

  if (!days) {
    return (
      <p className="form__status" role="status">
        {labels.loadingSlots}
      </p>
    );
  }

  return (
    <form
      className="form booking-form"
      data-picked={slot ? "true" : "false"}
      onSubmit={submit}
      noValidate
    >
      {days.length > 0 ? (
        <BookingCalendar
          days={days}
          lang={lang}
          activeDay={activeDay}
          selectedSlot={slot}
          onDayChange={setActiveDay}
          onSelect={setSlot}
          labels={{
            pickDay: labels.pickDay,
            pickSlot: labels.pickSlot,
            noSlots: labels.noSlots,
          }}
        />
      ) : (
        <p className="form__status" role="status">
          {labels.noSlots}
        </p>
      )}

      {slot && (
        <>
          <div className="booking-form__selected">
            <span className="booking-form__selected-text">
              <span className="booking-form__selected-label">
                {labels.selectedSlot}
              </span>
              <strong>{formatSlotLabel(slot, lang)}</strong>
            </span>
            <Btn variant="accent" onClick={() => setSlot(null)}>
              {labels.change}
            </Btn>
          </div>

          <fieldset ref={fieldsRef} className="booking-form__fields">
            <legend className="heading-sm booking-form__legend">
              {labels.formTitle}
            </legend>

            <div className="field">
              <label htmlFor="bk-name">{labels.name}</label>
              <input
                id="bk-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={labels.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="bk-email">{labels.email}</label>
              <input
                id="bk-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={labels.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="bk-phone">{labels.phone}</label>
              <input
                id="bk-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder={labels.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <span className="field__hint">{labels.phoneNote}</span>
            </div>

            <div className="field">
              <span className="field__label">{labels.mode}</span>
              <div
                className="booking-form__modes"
                role="radiogroup"
                aria-label={labels.mode}
              >
                <label
                  className="pill booking-form__mode"
                  data-active={meetingType === "video"}
                >
                  <input
                    type="radio"
                    name="meetingType"
                    value="video"
                    checked={meetingType === "video"}
                    onChange={() => setMeetingType("video")}
                  />
                  <Icon name="video" />
                  {labels.modeVideo}
                </label>
                <label
                  className="pill booking-form__mode"
                  data-active={meetingType === "call"}
                >
                  <input
                    type="radio"
                    name="meetingType"
                    value="call"
                    checked={meetingType === "call"}
                    onChange={() => setMeetingType("call")}
                  />
                  <Icon name="phone" />
                  {labels.modeCall}
                </label>
              </div>
            </div>

            <div className="field">
              <label htmlFor="bk-message">
                {labels.message}{" "}
                <span className="field__optional">({labels.optional})</span>
              </label>
              <textarea
                id="bk-message"
                name="message"
                rows={3}
                placeholder={labels.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Honeypot id="bk-company" value={company} onChange={setCompany} />

            <Turnstile
              key={attempt}
              siteKey={siteKey}
              onToken={onToken}
              label={labels.captchaLabel}
            />

            {errorKey && <Notice tone="error">{labels[errorKey]}</Notice>}

            <Btn type="submit" disabled={!canSubmit}>
              {status === "submitting" ? labels.submitting : labels.submit}
            </Btn>
          </fieldset>
        </>
      )}
    </form>
  );
}
