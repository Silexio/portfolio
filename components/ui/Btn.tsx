type BtnProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "ghost" | "ember";
  icon?: boolean;
  srHint?: string;
};

export function Btn({ children, href, onClick, variant, icon = true, srHint }: BtnProps) {
  const className = variant ? `btn btn--${variant}` : "btn";
  const inner = (
    <>
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
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a href={href} className={className} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {inner}
    </button>
  );
}
