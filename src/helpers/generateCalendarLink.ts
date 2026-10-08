import type { TestRecord } from "../types/test";

export const generateCalendarLink = (test: TestRecord) => {
  if (!test.startDate || !test.endDate) return '';

  const formatGoogleCalendarDate = (dateStr: string, timeStr: string = '00:00') => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  };

  const start = formatGoogleCalendarDate(test.startDate, test.startTime || '00:00');
  const end = formatGoogleCalendarDate(test.endDate, test.endTime || '23:59');
  const location = [
    test.location?.address,
    test.location?.city,
    test.location?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: test.name,
    details: test.description || 'Clinical trial event',
    location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};