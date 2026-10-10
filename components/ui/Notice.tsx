import type { ReactNode } from "react";

type NoticeProps = {
  tone: "success" | "error";
  title?: string;
  children: ReactNode;
};

/** Retour d'un envoi. La couleur ne porte jamais seule le sens : icône et texte disent la même chose. */
export function Notice({ tone, title, children }: NoticeProps) {
  return (
    <div
      className={`notice notice--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <svg
        className="notice__icon"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="9.5" />
        <path
          d={tone === "success" ? "M6.5 11.2l3 3 6-6.4" : "M11 6v6M11 15v.5"}
        />
      </svg>
      <div className="notice__text">
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
}
