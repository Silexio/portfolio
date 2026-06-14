"use client";

import { PackageIcon } from "@/components/ui/PackageIcon";
import type { PackageId } from "@/lib/data";
import { togglePackage, useSelectedPackages } from "@/hooks/usePackages";

export type PackageView = {
  id: PackageId;
  num: string;
  title: string;
  body: string;
  tags: string[];
};

type PackageCardProps = {
  pkg: PackageView;
  addLabel: string;
  addedLabel: string;
};

export function PackageCard({ pkg, addLabel, addedLabel }: PackageCardProps) {
  const selected = useSelectedPackages().includes(pkg.id);
  return (
    <article className="package" data-selected={selected}>
      <div>
        <div className="package__head">
          <span className="package__num">{pkg.num}</span>
          <PackageIcon id={pkg.id} />
        </div>
        <h3 className="package__title">{pkg.title}</h3>
        <p className="package__body">{pkg.body}</p>
      </div>
      <div className="package__foot">
        <div className="package__tags">
          {pkg.tags.map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
        <button
          type="button"
          className="package__add"
          aria-pressed={selected}
          aria-label={`${pkg.title} — ${selected ? addedLabel : addLabel}`}
          onClick={() => togglePackage(pkg.id)}
        >
          {selected ? addedLabel : addLabel}
        </button>
      </div>
    </article>
  );
}
