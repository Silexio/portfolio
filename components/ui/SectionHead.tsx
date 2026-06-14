import { Reveal } from "@/components/ui/Reveal";

type SectionHeadProps = {
  id: string;
  eyebrow: string;
  num: string;
  title: string;
  subtitle?: string;
};

export function SectionHead({ id, eyebrow, num, title, subtitle }: SectionHeadProps) {
  return (
    <Reveal className="section-head">
      <div>
        <span className="eyebrow">
          <span className="section-head__num">{num}</span>
          {eyebrow}
        </span>
        <h2 id={id} className="section-head__title">
          {title}
        </h2>
      </div>
      {subtitle && <p className="section-head__sub">{subtitle}</p>}
    </Reveal>
  );
}
