import { describe, expect, it } from "vitest";
import { monthlyHoursSaved } from "@/lib/roi";

describe("monthlyHoursSaved", () => {
  it("stays null while any figure is missing", () => {
    expect(
      monthlyHoursSaved({
        minutesBefore: null,
        minutesAfter: null,
        reportsPerWeek: null,
      }),
    ).toBeNull();
    expect(
      monthlyHoursSaved({
        minutesBefore: 20,
        minutesAfter: 5,
        reportsPerWeek: null,
      }),
    ).toBeNull();
  });

  it("turns minutes per report into whole hours per month", () => {
    expect(
      monthlyHoursSaved({
        minutesBefore: 20,
        minutesAfter: 5,
        reportsPerWeek: 40,
      }),
    ).toBe(43);
  });

  it("never reports a gain that is not one", () => {
    expect(
      monthlyHoursSaved({
        minutesBefore: 5,
        minutesAfter: 10,
        reportsPerWeek: 40,
      }),
    ).toBeNull();
    expect(
      monthlyHoursSaved({
        minutesBefore: 5,
        minutesAfter: 4,
        reportsPerWeek: 1,
      }),
    ).toBeNull();
  });
});
