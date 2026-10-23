const ZONE = 'America/Sao_Paulo';
export const SEND_HOUR = 7;

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function zonedParts(date: Date): ZonedParts {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map((part) => [part.type, Number(part.value)]),
  );
  return {
    year: parts.year ?? 0,
    month: parts.month ?? 1,
    day: parts.day ?? 1,
    hour: parts.hour ?? 0,
    minute: parts.minute ?? 0,
    second: parts.second ?? 0,
  };
}

function offsetAt(timestamp: number): number {
  const parts = zonedParts(new Date(timestamp));
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return localAsUtc - Math.floor(timestamp / 1000) * 1000;
}

// Brasília has no DST today, but the offset is looked up instead of hard-coded in case that changes again.
export function secondsUntilNextEdition(now: Date): number {
  const local = zonedParts(now);
  const followingDay = local.hour >= SEND_HOUR ? 1 : 0;
  const targetAsUtc = Date.UTC(local.year, local.month - 1, local.day + followingDay, SEND_HOUR);
  const firstGuess = targetAsUtc - offsetAt(targetAsUtc);
  const target = targetAsUtc - offsetAt(firstGuess);
  return Math.max(0, Math.ceil((target - now.getTime()) / 1000));
}

export function formatCountdown(seconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    hours: pad(Math.floor(seconds / 3600)),
    minutes: pad(Math.floor((seconds % 3600) / 60)),
    seconds: pad(seconds % 60),
  };
}
