export const formatEventDateRange = (start?: string, end?: string) => {
    if (!start || !end) return 'Dates not specified';
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startStr = startDate.toLocaleDateString('en-US', options);
    const endStr = endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });

    return `${startStr} - ${endStr}`;
};