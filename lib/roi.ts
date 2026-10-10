export type Roi = {
  minutesBefore: number | null;
  minutesAfter: number | null;
  reportsPerWeek: number | null;
};

const WEEKS_PER_MONTH = 52 / 12;

/** Heures rendues chaque mois, ou null tant qu'un chiffre manque ou que le gain est nul : jamais d'affichage à moitié rempli. */
export function monthlyHoursSaved({
  minutesBefore,
  minutesAfter,
  reportsPerWeek,
}: Roi): number | null {
  if (
    minutesBefore === null ||
    minutesAfter === null ||
    reportsPerWeek === null
  )
    return null;
  const hours =
    ((minutesBefore - minutesAfter) * reportsPerWeek * WEEKS_PER_MONTH) / 60;
  const rounded = Math.round(hours);
  return rounded > 0 ? rounded : null;
}
