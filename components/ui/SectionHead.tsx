import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeadProps = {
  id: string;
  title: string;
  lead?: string;
  eyebrow?: string;
  align?: "center" | "start";
  children?: ReactNode;
};

export function SectionHead({
  id,
  title,
  lead,
  eyebrow,
  align = "center",
  children,
}: SectionHeadProps) {
  return (
    <Reveal className={`section-head section-head--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="title">
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </Reveal>
  );
}
