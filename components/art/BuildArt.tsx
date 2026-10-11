import { Fragment } from "react";
import { cssVars } from "@/lib/css";
import { ART } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function BuildArt({ lang }: { lang: Locale }) {
  const planning = ART.planning;
  return (
    <div className="planning">
      <div className="planning__window">
        <div className="planning__bar">
          <span>{t(planning.title, lang)}</span>
          <span className="chip">{t(planning.sample, lang)}</span>
        </div>
        <div className="planning__grid">
          {planning.days.map((day, i) => (
            <span
              key={day.fr}
              className="planning__day"
              style={{ gridColumn: i + 2 }}
            >
              {t(day, lang)}
            </span>
          ))}
          {planning.rows.map((row, r) => (
            <Fragment key={row.team.fr}>
              <span className="planning__team" style={{ gridRow: r + 2 }}>
                {t(row.team, lang)}
              </span>
              {row.tasks.map((task) => (
                <span
                  key={task.label.fr}
                  className="planning__task"
                  data-tone={task.tone}
                  style={cssVars({
                    gridRow: r + 2,
                    gridColumn: `${task.span[0] + 1} / ${task.span[1] + 1}`,
                    "--i": r * 3 + task.span[0],
                  })}
                >
                  {t(task.label, lang)}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="planning__phone">
        <span className="heading-sm">{t(planning.today, lang)}</span>
        {planning.checklist.map((item, i) => (
          <span
            key={item.fr}
            className="planning__check"
            data-done={i === 0}
            style={cssVars({ "--i": i })}
          >
            {t(item, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}
