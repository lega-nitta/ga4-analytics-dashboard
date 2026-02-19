/**
 * 日付ユーティリティ
 * 元のGASコードのDateUtils.jsを参考に実装
 */

/**
 * 日付文字列をパース（today, yesterday, 7daysAgo等）
 */
export function parseDateString(dateString: string | null | undefined): string {
    if (!dateString || typeof dateString !== 'string') {
        return dateString || '';
    }

    const text = dateString.trim().toLowerCase();
    const now = new Date();

    if (text === 'today') {
        return formatDateForGA4(now);
    }

    if (text === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return formatDateForGA4(yesterday);
    }

    const daysAgoMatch = text.match(/^(\d+)daysago$/);
    if (daysAgoMatch) {
        const daysAgo = new Date(now);
        daysAgo.setDate(daysAgo.getDate() - parseInt(daysAgoMatch[1], 10));
        return formatDateForGA4(daysAgo);
    }

    return dateString;
}

/**
 * 日付をGA4形式（yyyy-MM-dd）にフォーマット
 */
export function formatDateForGA4(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 2つの日付間の日数を計算
 */
export function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return daysDiff;
}

/**
 * 月の週範囲を取得
 */
export function getWeeklyRangesForMonth(year: number, month: number): Array<{ start: string; end: string }> {
    const ranges: Array<{ start: string; end: string }> = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    let currentDay = new Date(firstDayOfMonth);

    while (currentDay <= lastDayOfMonth) {
        const weekEnd = new Date(currentDay);
        weekEnd.setDate(weekEnd.getDate() + (6 - currentDay.getDay()));
        if (weekEnd > lastDayOfMonth) {
            weekEnd.setTime(lastDayOfMonth.getTime());
        }

        ranges.push({
            start: formatDateForGA4(currentDay),
            end: formatDateForGA4(weekEnd),
        });

        currentDay = new Date(weekEnd);
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return ranges;
}
