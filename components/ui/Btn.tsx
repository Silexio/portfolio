type BtnProps = {
  children: React.ReactNode;
  href: string;
  variant?: "ghost" | "ember";
  icon?: boolean;
  srHint?: string;
};

export function Btn({ children, href, variant, icon = true, srHint }: BtnProps) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={variant ? `btn btn--${variant}` : "btn"}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
      {srHint && <span className="sr-only"> — {srHint}</span>}
      {icon && (
        <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}
