type ChipProps = {
  children: React.ReactNode;
  variant?: "default" | "ember";
  live?: boolean;
};

export function Chip({ children, variant = "default", live = false }: ChipProps) {
  const classes = ["chip", variant === "ember" && "chip--ember", live && "chip--live"]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
