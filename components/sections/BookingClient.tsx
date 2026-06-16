"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookingCalendar, type CalendarDay } from "@/components/ui/BookingCalendar";
import { Turnstile } from "@/components/ui/Turnstile";
import { closeBooking } from "@/hooks/useBookingModal";
import { useSelectedPackages } from "@/hooks/usePackages";
import { formatSlotLabel } from "@/lib/booking/format";
import type { MeetingMode } from "@/lib/booking/schema";
import type { BookingLabels, PackageId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

type BookingClientProps = {
  lang: Locale;
  siteKey: string;
  active: boolean;
  labels: BookingLabels;
  packageLabels: Record<PackageId, string>;
};

type Status = "idle" | "submitting" | "success" | "error";
type ErrorKey = "errorGeneric" | "errorSlotTaken" | "errorRate" | "errorCaptcha" | "errorValidation";

const ERROR_BY_CODE: Record<string, ErrorKey> = {
  slot_taken: "errorSlotTaken",
  invalid_slot: "errorSlotTaken",
  rate_limit: "errorRate",
  captcha: "errorCaptcha",
  validation: "errorValidation",
};

export function BookingClient({ lang, siteKey, active, labels, packageLabels }: BookingClientProps) {
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
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const fieldsRef = useRef<HTMLFieldSetElement>(null);

  const selectedPackages = useSelectedPackages().filter((id) => id in packageLabels);

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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fieldsRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }, [slot]);

  useEffect(() => {
    if (status !== "success") return;
    const id = window.setTimeout(() => closeBooking(), 2500);
    return () => window.clearTimeout(id);
  }, [status]);

  const onToken = useCallback((value: string | null) => setToken(value), []);

  const canSubmit =
    Boolean(slot) && Boolean(token) && name.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && status !== "submitting";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slot || !token || status === "submitting") return;
    setStatus("submitting");
    setErrorKey(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotStart: slot,
          name,
          email,
          phone,
          meetingType,
          message,
          company,
          packages: selectedPackages,
          locale: lang,
          turnstileToken: token,
        }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      let key: ErrorKey = "errorGeneric";
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error && body.error in ERROR_BY_CODE) key = ERROR_BY_CODE[body.error];
      } catch {
        // keep generic
      }
      setErrorKey(key);
      setStatus("error");
    } catch {
      setErrorKey("errorGeneric");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="booking-form__success" role="status">
        <h3>{labels.successTitle}</h3>
        <p>{labels.successBody}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="booking-form__error" role="alert">
        {labels.slotsError}
      </p>
    );
  }

  if (!days) {
    return <p className="booking-form__loading">{labels.loadingSlots}</p>;
  }

  return (
    <form className="booking-form" data-picked={slot ? "true" : "false"} onSubmit={submit} noValidate>
      {days.length > 0 ? (
        <BookingCalendar
          days={days}
          lang={lang}
          activeDay={activeDay}
          selectedSlot={slot}
          onDayChange={setActiveDay}
          onSelect={setSlot}
          labels={{ pickDay: labels.pickDay, pickSlot: labels.pickSlot, noSlots: labels.noSlots }}
        />
      ) : (
        <p className="booking-form__loading">{labels.noSlots}</p>
      )}

      {slot && (
        <>
          <div className="booking-form__selected">
            <span className="booking-form__selected-text">
              <span className="booking-form__selected-label">{labels.selectedSlot}</span>
              <strong>{formatSlotLabel(slot, lang)}</strong>
            </span>
            <button type="button" className="booking-form__change" onClick={() => setSlot(null)}>
              {labels.change}
            </button>
          </div>

          <fieldset ref={fieldsRef} className="booking-form__fields">
            <legend className="booking-form__legend">{labels.formTitle}</legend>

            <div className="booking-form__field">
              <label htmlFor="bk-name">{labels.name}</label>
              <input id="bk-name" name="name" type="text" autoComplete="name" required
                placeholder={labels.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="booking-form__field">
              <label htmlFor="bk-email">{labels.email}</label>
              <input id="bk-email" name="email" type="email" autoComplete="email" required
                placeholder={labels.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="booking-form__field">
              <label htmlFor="bk-phone">{labels.phone}</label>
              <input id="bk-phone" name="phone" type="tel" autoComplete="tel" required
                placeholder={labels.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
              <span className="booking-form__hint">{labels.phoneNote}</span>
            </div>

            <div className="booking-form__field">
              <span className="booking-form__field-label">{labels.mode}</span>
              <div className="booking-form__modes" role="radiogroup" aria-label={labels.mode}>
                <label className="booking-form__mode" data-active={meetingType === "video"}>
                  <input type="radio" name="meetingType" value="video"
                    checked={meetingType === "video"} onChange={() => setMeetingType("video")} />
                  {labels.modeVideo}
                </label>
                <label className="booking-form__mode" data-active={meetingType === "call"}>
                  <input type="radio" name="meetingType" value="call"
                    checked={meetingType === "call"} onChange={() => setMeetingType("call")} />
                  {labels.modeCall}
                </label>
              </div>
            </div>

            <div className="booking-form__field">
              <label htmlFor="bk-message">
                {labels.message} <span className="booking-form__optional">({labels.optional})</span>
              </label>
              <textarea id="bk-message" name="message" rows={3}
                placeholder={labels.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            {selectedPackages.length > 0 && (
              <div className="booking-form__field">
                <span className="booking-form__field-label">{labels.interests}</span>
                <div className="booking-form__chips">
                  {selectedPackages.map((id) => (
                    <span key={id} className="chip chip--ember">{packageLabels[id]}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="booking-form__honeypot" aria-hidden="true">
              <label htmlFor="bk-company">Company</label>
              <input id="bk-company" name="company" type="text" tabIndex={-1} autoComplete="off"
                value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            <Turnstile siteKey={siteKey} onToken={onToken} label={labels.captchaLabel} />

            {errorKey && (
              <p className="booking-form__error" role="alert">{labels[errorKey]}</p>
            )}

            <button type="submit" className="btn btn--ember booking-form__submit" disabled={!canSubmit}>
              {status === "submitting" ? labels.submitting : labels.submit}
            </button>
          </fieldset>
        </>
      )}
    </form>
  );
}
