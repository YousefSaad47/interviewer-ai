const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const formatAdminDate = (value: string) =>
  dateFormatter.format(new Date(value));

export const formatAdminDateTime = (value: string) =>
  dateTimeFormatter.format(new Date(value));

export const formatDuration = (seconds: number | null) => {
  if (seconds === null) {
    return "--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return remainingSeconds === 0
    ? `${minutes}m`
    : `${minutes}m ${remainingSeconds}s`;
};

export const formatNullableScore = (score: number | null) => {
  if (score === null) {
    return null;
  }

  return Math.round(score);
};

export const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
