import { formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export type RelativeTimeInput = Date | string | number | null | undefined;

function normalizeDate(value: RelativeTimeInput): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const date = typeof value === "string" ? parseISO(value) : new Date(value);

  if (!isValid(date)) {
    return null;
  }

  return date;
}

export function formatRelativeTime(value: RelativeTimeInput): string {
  const date = normalizeDate(value);

  if (!date) {
    return "";
  }

  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: ko,
  });
}
