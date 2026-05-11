export const formatTimeInput = (hour: number, minute = 0) => {
  const normalizedHour = String(Math.min(Math.max(hour, 0), 23)).padStart(2, '0');
  const normalizedMinute = String(Math.min(Math.max(minute, 0), 59)).padStart(2, '0');
  return `${normalizedHour}:${normalizedMinute}`;
};

export const toTimeInputValue = (value: string, fallbackHour: number) => {
  const directMatch = value.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (directMatch) {
    return value.trim();
  }
  const ampmMatch = value.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(AM)$/i);
  if (ampmMatch) {
    const rawHour = Number(ampmMatch[1]);
    const minute = Number(ampmMatch[2] ?? '0');
    const convertedHour = rawHour % 12 === 0 ? 12 : rawHour % 12;
    return formatTimeInput(convertedHour, minute);
  }
  return formatTimeInput(fallbackHour, 0);
};

export const parseHourFromTimeInput = (value: string, fallback: number) => {
  const normalized = toTimeInputValue(value, fallback);
  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return fallback;
  }
  return Number(match[1]);
};

export const clampTimeInputRange = (value: string, minValue: string, maxValue: string) => {
  if (value < minValue) {
    return minValue;
  }
  if (value > maxValue) {
    return maxValue;
  }
  return value;
};

export const formatDisplayTime = (value: string, fallbackHour: number) => {
  const normalized = toTimeInputValue(value, fallbackHour);
  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return normalized;
  }
  const hour24 = Number(match[1]);
  const minute = match[2];
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute} AM`;
};

export const parseTimeParts = (value: string, fallbackHour: number) => {
  const normalized = toTimeInputValue(value, fallbackHour);
  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return {
      hour: fallbackHour,
      minute: 0,
      totalMinutes: fallbackHour * 60,
    };
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return {
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
  };
};

export const formatTo12Hour = (time24?: string) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hours = parseInt(h, 10);
  if (isNaN(hours)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${m || '00'} ${ampm}`;
};