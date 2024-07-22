export const MinutesToMs = (minutes: number) => minutes * 60 * 1000;

export const HoursToMs = (hours: number) => hours * MinutesToMs(60);

export const YearsToMs = (yearsCount: number) =>
  yearsCount * 365.25 * 24 * 60 * 60 * 1000;

export const DateAddYear = (date: Date, yearsCount: number) =>
  new Date(date.getTime() + YearsToMs(yearsCount));

export const DateAddDays = (date: Date, daysCount: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + daysCount);
  return result;
};

export const DateAddHours = (date: Date, hours: number) =>
  new Date(date.getTime() + HoursToMs(hours));

export const DateAddSeconds = (date: Date, seconds: number) =>
  new Date(date.getTime() + seconds * 1000);
