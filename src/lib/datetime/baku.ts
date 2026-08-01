export const BAKU_TIMEZONE = "Asia/Baku";

/** Azerbaijan uses a fixed UTC+4 offset (no DST since 2016). */
const BAKU_OFFSET_MS = 4 * 60 * 60 * 1000;

type BakuWallClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
};

export function toBakuWallClock(date: Date): BakuWallClock {
  const shifted = new Date(date.getTime() + BAKU_OFFSET_MS);

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
    ms: shifted.getUTCMilliseconds(),
  };
}

export function fromBakuWallClock(clock: BakuWallClock): Date {
  return new Date(
    Date.UTC(
      clock.year,
      clock.month - 1,
      clock.day,
      clock.hour,
      clock.minute,
      clock.second,
      clock.ms
    ) - BAKU_OFFSET_MS
  );
}

export function addCalendarDaysInBaku(date: Date, days: number): Date {
  const clock = toBakuWallClock(date);
  const added = new Date(
    Date.UTC(
      clock.year,
      clock.month - 1,
      clock.day + days,
      clock.hour,
      clock.minute,
      clock.second,
      clock.ms
    )
  );

  return fromBakuWallClock({
    year: added.getUTCFullYear(),
    month: added.getUTCMonth() + 1,
    day: added.getUTCDate(),
    hour: added.getUTCHours(),
    minute: added.getUTCMinutes(),
    second: added.getUTCSeconds(),
    ms: added.getUTCMilliseconds(),
  });
}

export function formatDateTimeInBaku(
  date: Date | string,
  locale = "az-AZ"
): string {
  const value = typeof date === "string" ? new Date(date) : date;

  return value.toLocaleString(locale, {
    timeZone: BAKU_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
