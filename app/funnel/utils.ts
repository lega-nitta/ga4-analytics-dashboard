/**
 * ファネルページ用のユーティリティ関数
 */

import type { Period, ComparisonData } from './types'

/**
 * 日付をフォーマット（YYYY-MM-DD）
 */
export function formatDateString(date: Date): string {
    return date.toISOString().split('T')[0]
}

/**
 * デフォルト期間を取得（単一期間用）
 */
export function getDefaultSinglePeriod(): { startDate: string; endDate: string } {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    return {
        startDate: formatDateString(yesterday),
        endDate: formatDateString(today),
    }
}

/**
 * デフォルト期間を取得（期間比較用）
 */
export function getDefaultComparisonPeriods(): Array<{ label: string; startDate: string; endDate: string }> {
    const today = new Date()
    const lastWeekStart = new Date(today)
    lastWeekStart.setDate(today.getDate() - 14)
    const lastWeekEnd = new Date(today)
    lastWeekEnd.setDate(today.getDate() - 8)
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - 7)

    return [
        { label: '先週', startDate: formatDateString(lastWeekStart), endDate: formatDateString(lastWeekEnd) },
        { label: '今週', startDate: formatDateString(thisWeekStart), endDate: formatDateString(today) },
    ]
}

/**
 * 期間データを取得（後方互換性対応）
 */
export function getPeriodsFromComparisonData(comparisonData: ComparisonData | null): Array<{
    label: string
    startDate: string
    endDate: string
    data: any
}> {
    if (!comparisonData) return []
    
    if (comparisonData.periods && comparisonData.periods.length > 0) {
        return comparisonData.periods
    }
    
    if (comparisonData.periodA && comparisonData.periodB) {
        return [comparisonData.periodA, comparisonData.periodB]
    }
    
    return []
}
