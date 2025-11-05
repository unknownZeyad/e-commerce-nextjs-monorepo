export function formatCloudinaryTime(isoString: string, locale = "en-US"): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",   
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,     
  });
}

