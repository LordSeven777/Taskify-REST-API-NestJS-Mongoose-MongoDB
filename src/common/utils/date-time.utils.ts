/**
 * Gets the starting time and the ending time of a date i.e {date}T00:00:00 and {date}T23:59:59
 * @param date A given date in a date compliant format
 * @return The given date's starting and ending times respectively in a ISO date format
 */
export function getDateEdgeTimes(date: string): [string, string] {
  const dateTimes: [string, string] = ['', ''];
  const d = new Date(date);
  // Starting time
  d.setHours(0, 0, 0);
  dateTimes[0] = d.toISOString();
  // Ending time
  d.setHours(23, 59, 59);
  dateTimes[1] = d.toISOString();
  return dateTimes;
}
