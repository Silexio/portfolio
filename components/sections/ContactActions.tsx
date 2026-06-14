"use client";

import { Btn } from "@/components/ui/Btn";
import type { PackageId } from "@/lib/data";
import { togglePackage, useSelectedPackages } from "@/hooks/usePackages";

type ContactActionsProps = {
  calUrl: string;
  email: string;
  packageLabels: Record<PackageId, string>;
  labels: {
    cal: string;
    quote: string;
    interests: string;
    subject: string;
    servicesEmpty: string;
    emailBody: string;
    newTab: string;
    remove: string;
  };
};

export function ContactActions({ calUrl, email, packageLabels, labels }: ContactActionsProps) {
  const selected = useSelectedPackages().filter((id) => id in packageLabels);
  const hasPicks = selected.length > 0;
  const services = hasPicks ? selected.map((id) => packageLabels[id]).join(", ") : labels.servicesEmpty;

  const subject = hasPicks ? `${labels.subject} - ${services}` : labels.subject;
  const body = labels.emailBody.replace("{services}", services);
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const calHref = hasPicks
    ? `${calUrl}?notes=${encodeURIComponent(`${labels.interests} : ${services}`)}`
    : calUrl;

  return (
    <>
      {hasPicks && (
        <div className="contact__picks">
          <span className="contact__picks-label">{labels.interests}</span>
          <div className="contact__picks-chips">
            {selected.map((id) => (
              <button
                key={id}
                type="button"
                className="chip chip--ember chip--remove"
                aria-label={`${packageLabels[id]} — ${labels.remove}`}
                onClick={() => togglePackage(id)}
              >
                {packageLabels[id]}
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="contact__cta">
        <Btn href={calHref} variant="ember" srHint={labels.newTab}>
          {labels.cal}
        </Btn>
        <Btn href={mailtoHref} variant="ghost">
          {labels.quote}
        </Btn>
      </div>
    </>
  );
}
