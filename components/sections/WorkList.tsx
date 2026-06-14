"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";

export type ProjectView = {
  id: string;
  num: string;
  name: string;
  year: number;
  url: string;
  stack: string[];
  statusLabel: string;
  live: boolean;
  summary: string;
  detail: string;
  stars?: string;
};

type WorkListProps = {
  projects: ProjectView[];
  viewLabel: string;
  detailLabel: string;
  newTabHint: string;
};

export function WorkList({ projects, viewLabel, detailLabel, newTabHint }: WorkListProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul className="work__list">
      {projects.map((project) => {
        const isOpen = open === project.id;
        return (
          <li key={project.id} className="project" data-open={isOpen}>
            <button
              type="button"
              className="project__head"
              aria-expanded={isOpen}
              aria-controls={`project-${project.id}`}
              aria-label={`${project.name} — ${detailLabel}`}
              onClick={() => setOpen(isOpen ? null : project.id)}
            >
              <span className="project__num">{project.num}</span>
              <div>
                <div className="project__name-row">
                  <h3 className="project__name">{project.name}</h3>
                  <Chip variant="ember" live={project.live}>{project.statusLabel}</Chip>
                  {project.stars && <Chip>★ {project.stars}</Chip>}
                </div>
                <p className="project__summary">{project.summary}</p>
              </div>
              <div className="project__stack">
                {project.stack.slice(0, 3).map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
              <span className="project__year mono">{project.year}</span>
              <span className="project__chev" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className="project__detail" id={`project-${project.id}`} inert={!isOpen}>
              <div className="project__detail-inner">
                <div className="project__detail-content">
                  <div>
                    <p>{project.detail}</p>
                    <div className="project__detail-stack">
                      {project.stack.map((item) => (
                        <Chip key={item}>{item}</Chip>
                      ))}
                    </div>
                  </div>
                  <Btn href={project.url} variant="ghost" srHint={newTabHint}>
                    {viewLabel}
                  </Btn>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
