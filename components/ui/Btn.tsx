import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export type BtnVariant = "primary" | "link" | "accent" | "pill" | "pillStrong";

const CLASS: Record<BtnVariant, string> = {
  primary: "btn",
  link: "link link--action",
  accent: "link link--accent link--action",
  pill: "pill",
  pillStrong: "pill pill--strong",
};

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: BtnVariant;
  /** Complète le nom accessible sans le remplacer, par ex. « ouvre un nouvel onglet ». */
  srHint?: string;
  className?: string;
  /** Glyphe placé avant le libellé. « arrow » se place après, comme le veut l'usage. */
  icon?: IconName;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Toute action cliquable du site : un lien externe s'ouvre dans un nouvel onglet, un `onClick` ou un `type` rend un bouton. */
export function Btn({
  children,
  href,
  onClick,
  variant = "primary",
  srHint,
  className,
  icon,
  type = "button",
  disabled,
}: BtnProps) {
  const classes = [CLASS[variant], className].filter(Boolean).join(" ");
  const content = (
    <>
      {icon && icon !== "arrow" && <Icon name={icon} />}
      {children}
      {srHint && <span className="sr-only"> — {srHint}</span>}
      {icon === "arrow" && <Icon name="arrow" />}
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
