"use client";

import { useId, useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { Honeypot } from "@/components/ui/Honeypot";
import { Notice } from "@/components/ui/Notice";
import { Turnstile } from "@/components/ui/Turnstile";
import { useDoneFocus } from "@/hooks/useDoneFocus";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { LeadLabels } from "@/lib/data";
import {
  HOURS_LABEL,
  LEAD_HOURS,
  TASK_MAX,
  TASK_MIN,
  isLeadHours,
  type LeadHours,
  type LeadSource,
} from "@/lib/leads/constants";
import type { Locale } from "@/lib/i18n/config";

type LeadFormProps = {
  lang: Locale;
  source: LeadSource;
  askHours: boolean;
  siteKey: string;
  taskLabel: string;
  taskPlaceholder: string;
  legalHref: string;
  labels: LeadLabels;
};

type ErrorKey =
  "errorGeneric" | "errorRate" | "errorCaptcha" | "errorValidation";

const ERROR_BY_CODE: Record<string, ErrorKey> = {
  rate_limit: "errorRate",
  captcha: "errorCaptcha",
  validation: "errorValidation",
};

/**
 * Formulaire « Montrez-moi la tâche ». Turnstile n'est monté qu'au premier focus : aucun script
 * tiers n'est chargé tant que le visiteur n'a pas commencé à écrire. Un jeton Turnstile ne sert
 * qu'une fois, d'où le remontage du widget (`attempt`) après chaque échec.
 */
export function LeadForm({
  lang,
  source,
  askHours,
  siteKey,
  taskLabel,
  taskPlaceholder,
  legalHref,
  labels,
}: LeadFormProps) {
  const id = useId();
  const [task, setTask] = useState("");
  const [hours, setHours] = useState<LeadHours | "">("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [armed, setArmed] = useState(false);
  const { status, errorKey, token, attempt, onToken, send } =
    useFormSubmit<ErrorKey>({
      url: "/api/leads",
      errorByCode: ERROR_BY_CODE,
      genericError: "errorGeneric",
    });
  const doneRef = useDoneFocus(status === "success");

  const canSubmit =
    task.trim().length >= TASK_MIN &&
    email.trim() !== "" &&
    Boolean(token) &&
    status !== "submitting";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    void send({
      task: task.trim(),
      hours: hours || undefined,
      email: email.trim(),
      source,
      locale: lang,
      company,
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

  return (
    <form
      className="form lead-form"
      onSubmit={submit}
      onFocus={() => setArmed(true)}
      noValidate
    >
      <div className="field">
        <label htmlFor={`${id}-task`}>{taskLabel}</label>
        <textarea
          id={`${id}-task`}
          name="task"
          rows={4}
          required
          minLength={TASK_MIN}
          maxLength={TASK_MAX}
          placeholder={taskPlaceholder}
          aria-describedby={`${id}-task-hint`}
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <span id={`${id}-task-hint`} className="field__hint">
          {labels.taskHint}
        </span>
      </div>

      <div className="form__row">
        {askHours && (
          <div className="field">
            <label htmlFor={`${id}-hours`}>
              {labels.hours}{" "}
              <span className="field__optional">({labels.optional})</span>
            </label>
            <select
              id={`${id}-hours`}
              name="hours"
              value={hours}
              onChange={(e) => {
                const value = e.target.value;
                setHours(isLeadHours(value) ? value : "");
              }}
            >
              <option value="">{labels.hoursPlaceholder}</option>
              {LEAD_HOURS.map((range) => (
                <option key={range} value={range}>
                  {labels[HOURS_LABEL[range]]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor={`${id}-email`}>{labels.email}</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={labels.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Honeypot id={`${id}-company`} value={company} onChange={setCompany} />

      {armed && (
        <Turnstile
          key={attempt}
          siteKey={siteKey}
          onToken={onToken}
          label={labels.captchaLabel}
        />
      )}

      {errorKey && <Notice tone="error">{labels[errorKey]}</Notice>}

      <div className="form__foot">
        <Btn type="submit" disabled={!canSubmit}>
          {status === "submitting" ? labels.submitting : labels.submit}
        </Btn>
        <p className="form__privacy">
          {labels.privacy}{" "}
          <a className="link link--accent" href={legalHref}>
            {labels.privacyLink}
          </a>
        </p>
      </div>
    </form>
  );
}
