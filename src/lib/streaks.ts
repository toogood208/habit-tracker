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
    let cursor = new Date(`${currentDay}T00:00:00`);
    while (true) {
        const dateKey = cursor.toISOString().slice(0, 10);
        if (!completedDays.has(dateKey)) {
            break;
        }

        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}