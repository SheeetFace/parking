export function formatDate(dateString: string | null) {
    if (dateString) {
        const options: Intl.DateTimeFormatOptions = { 
            day: 'numeric', 
            month: 'long', 
            weekday: 'short'
        };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('by-BY', options).format(date);
    } else {
        return null;
    }
}