/**
 * Generates and downloads an .ics calendar file for a rush event.
 * Times are floating local times (recruits are local to UCI).
 */
function pad(n) {
  return String(n).padStart(2, "0");
}

function formatLocal(dt) {
  return (
    dt.getFullYear() +
    pad(dt.getMonth() + 1) +
    pad(dt.getDate()) +
    "T" +
    pad(dt.getHours()) +
    pad(dt.getMinutes()) +
    "00"
  );
}

function formatUtcStamp(dt) {
  return (
    dt.getUTCFullYear() +
    pad(dt.getUTCMonth() + 1) +
    pad(dt.getUTCDate()) +
    "T" +
    pad(dt.getUTCHours()) +
    pad(dt.getUTCMinutes()) +
    pad(dt.getUTCSeconds()) +
    "Z"
  );
}

export function buildIcs({ name, start, end, location }) {
  // RFC 5545 requires DTSTAMP in UTC.
  const stamp = formatUtcStamp(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AKPsi UCI//Rush//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}-${name.replace(/\W/g, "")}@akpsi-uci.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatLocal(start)}`,
    `DTEND:${formatLocal(end)}`,
    `SUMMARY:${name} — AKPsi UCI Rush`,
    location ? `LOCATION:${location}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcs(event) {
  const blob = new Blob([buildIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
