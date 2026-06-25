export const money = (amountCents: number | null | undefined, currency = 'USD') =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format((amountCents ?? 0) / 100);

export const dateTime = (value: string | null | undefined) =>
    value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value)) : 'Waiting for activity';
