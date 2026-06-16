import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BOOKING_ACTION, I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { asLocale, t, type Bilingual } from "@/lib/i18n/utils";
import type { MeetingMode } from "@/lib/booking/schema";
import { verifyAction, type BookingAction } from "@/lib/booking/token";
import { getPrisma } from "@/lib/booking/prisma";
import { formatSlotLabel } from "@/lib/booking/format";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Result = { title: Bilingual; body: Bilingual };

function resultFor(state: string): Result {
  const A = BOOKING_ACTION;
  const map: Record<string, Result> = {
    confirmed: { title: A.confirmedTitle, body: A.confirmedBody },
    refused: { title: A.refusedTitle, body: A.refusedBody },
    already: { title: A.alreadyTitle, body: A.alreadyBody },
    expired: { title: A.expiredTitle, body: A.expiredBody },
    invalid: { title: A.invalidTitle, body: A.invalidBody },
  };
  return map[state] ?? { title: A.invalidTitle, body: A.invalidBody };
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="booking-action">
      <div className="booking-action__card">{children}</div>
    </main>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h1 className="booking-action__title">{title}</h1>
      <p className="booking-action__body">{body}</p>
    </>
  );
}

export default async function BookingActionPage({ params, searchParams }: PageProps<"/[lang]/booking/[action]">) {
  const { lang: langRaw, action } = await params;
  const lang: Locale = asLocale(langRaw);
  if (action !== "confirm" && action !== "refuse") notFound();
  const act = action as BookingAction;

  const sp = await searchParams;
  const state = typeof sp.state === "string" ? sp.state : undefined;
  if (state) {
    const r = resultFor(state);
    return (
      <Shell>
        <Message title={t(r.title, lang)} body={t(r.body, lang)} />
      </Shell>
    );
  }

  const id = typeof sp.id === "string" ? sp.id : "";
  const token = typeof sp.token === "string" ? sp.token : "";
  if (!id || !token || !verifyAction(id, act, token)) {
    return (
      <Shell>
        <Message title={t(BOOKING_ACTION.invalidTitle, lang)} body={t(BOOKING_ACTION.invalidBody, lang)} />
      </Shell>
    );
  }

  let booking: { name: string; slotStart: Date; meetingType: MeetingMode; status: string } | null = null;
  try {
    booking = await getPrisma().booking.findUnique({
      where: { id },
      select: { name: true, slotStart: true, meetingType: true, status: true },
    });
  } catch {
    booking = null;
  }
  if (!booking) {
    return (
      <Shell>
        <Message title={t(BOOKING_ACTION.invalidTitle, lang)} body={t(BOOKING_ACTION.invalidBody, lang)} />
      </Shell>
    );
  }
  if (booking.status !== "pending") {
    return (
      <Shell>
        <Message title={t(BOOKING_ACTION.alreadyTitle, lang)} body={t(BOOKING_ACTION.alreadyBody, lang)} />
      </Shell>
    );
  }

  const slot = formatSlotLabel(booking.slotStart.toISOString(), lang);
  const mode = t(booking.meetingType === "video" ? I18N.booking.modeVideo : I18N.booking.modeCall, lang);
  const question = act === "confirm" ? BOOKING_ACTION.confirmQuestion : BOOKING_ACTION.refuseQuestion;
  const cta = act === "confirm" ? BOOKING_ACTION.confirmCta : BOOKING_ACTION.refuseCta;

  return (
    <Shell>
      <h1 className="booking-action__title">{t(question, lang)}</h1>
      <p className="booking-action__summary">
        <strong>{booking.name}</strong> · {slot} · {mode}
      </p>
      <form method="post" action={`/api/bookings/${act}`} className="booking-action__actions">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={`btn ${act === "confirm" ? "btn--ember" : "btn--ghost"}`}>
          {t(cta, lang)}
        </button>
      </form>
    </Shell>
  );
}
