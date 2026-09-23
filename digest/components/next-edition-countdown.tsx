'use client';

import { useEffect, useState } from 'react';
import { copy, type Locale } from '../lib/copy';

const zone = 'America/Sao_Paulo';
const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: zone,
  hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function zonedParts(date: Date) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(date).map(part => [part.type, Number(part.value)]));
  return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute, second: parts.second };
}

function offsetAt(timestamp: number) {
  const parts = zonedParts(new Date(timestamp));
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return localAsUtc - Math.floor(timestamp / 1000) * 1000;
}

function secondsUntilNextEdition(now: Date) {
  const local = zonedParts(now);
  const followingDay = local.hour >= 7 ? 1 : 0;
  const targetDate = new Date(Date.UTC(local.year, local.month - 1, local.day + followingDay, 7));
  const targetAsUtc = targetDate.getTime();
  let target = targetAsUtc - offsetAt(targetAsUtc);
  target = targetAsUtc - offsetAt(target);
  return Math.max(0, Math.ceil((target - now.getTime()) / 1000));
}

export function NextEditionCountdown({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(secondsUntilNextEdition(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const hours = remaining === null ? '--' : String(Math.floor(remaining / 3600)).padStart(2, '0');
  const minutes = remaining === null ? '--' : String(Math.floor(remaining % 3600 / 60)).padStart(2, '0');
  const seconds = remaining === null ? '--' : String(remaining % 60).padStart(2, '0');

  return <div className="edition-countdown">
    <div className="edition-countdown-header">
      <span className="live-dot" aria-hidden="true" />
      <span>{t.nextEdition}</span>
      <span className="edition-time">07:00 BRT</span>
    </div>
    <div className="countdown-digits" role="timer" aria-label={t.countdown} aria-live="off">
      <span><strong>{hours}</strong><small>{t.hours}</small></span>
      <i aria-hidden="true">:</i>
      <span><strong>{minutes}</strong><small>{t.minutes}</small></span>
      <i aria-hidden="true">:</i>
      <span><strong>{seconds}</strong><small>{t.seconds}</small></span>
    </div>
    <p className="edition-schedule">{t.everyDay}</p>
  </div>;
}
