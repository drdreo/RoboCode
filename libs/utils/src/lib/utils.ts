export function utils(): string {
  return 'utils';
}

export function formatTime(timestamp: number): string {
  const dt =  new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  });

  return dt.format(new Date(timestamp));
}
