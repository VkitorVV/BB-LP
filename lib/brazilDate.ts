/**
 * Returns today's date in YYYY-MM-DD format using America/Sao_Paulo timezone.
 * Prevents the UTC vs BRT offset bug (UTC is 3h ahead of BRT).
 */
export function getBrazilDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year:     'numeric',
    month:    '2-digit',
    day:      '2-digit',
  }).format(new Date());
}
