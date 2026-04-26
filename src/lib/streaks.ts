function getPreviousDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setUTCDate(utcDate.getUTCDate() - 1);

    return utcDate.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
    completions: string[],
    today?: string
): number {
    const currentDay = today ? today : new Date().toISOString().slice(0, 10);
    const uniqueDates = [...new Set(completions)].sort();
    if (!uniqueDates.includes(currentDay)) {
        return 0;
    }

    const completedDays = new Set(uniqueDates);
    let streak = 0;
    let cursor = currentDay;
    while (true) {
        if (!completedDays.has(cursor)) {
            break;
        }

        streak += 1;
        cursor = getPreviousDate(cursor);
    }
    return streak;
}
