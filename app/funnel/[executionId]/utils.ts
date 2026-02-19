/**
 * ファネル実行詳細ページ用のユーティリティ関数
 */

import type { FunnelStepData, FunnelData, ComparisonData } from '@/app/funnel/types'

/**
 * エラーメッセージを日本語に変換
 */
export function translateErrorMessage(errorMsg: string): string {
    const translations: Record<string, string> = {
        'Funnel execution not found': 'ファネル実行が見つかりませんでした',
    }
    return translations[errorMsg] || errorMsg
}

/**
 * 最大離脱ステップを取得
 */
export function getMaxDropoffStep(steps: FunnelStepData[]): string {
    let maxDropoff = 0
    let maxDropoffStep = 'なし'
    for (let i = 1; i < steps.length; i++) {
        if (steps[i].dropoffRate > maxDropoff) {
            maxDropoff = steps[i].dropoffRate
            maxDropoffStep = steps[i].stepName
        }
    }
    return maxDropoffStep
}

/**
 * 日付をフォーマット
 */
export function formatDate(dateString: string | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * 比較データがあるかチェック
 */
export function hasComparisonData(resultData: any): boolean {
    return resultData && (
        ('periods' in resultData && Array.isArray(resultData.periods) && resultData.periods.length > 1) ||
        ('periodA' in resultData && 'periodB' in resultData)
    )
}

/**
 * 期間データを取得（後方互換性対応）
 */
export function getPeriodsFromComparisonData(comparisonData: ComparisonData | null): Array<{
    label: string
    startDate: string
    endDate: string
    data: FunnelData
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

/**
 * 期間データからFunnelDataを抽出
 */
export function extractFunnelDataFromPeriod(
    period: { data: FunnelData },
    executionGeminiEvaluation?: string | null
): FunnelData {
    return {
        steps: period.data.steps,
        totalUsers: period.data.totalUsers,
        geminiEvaluation: period.data.geminiEvaluation || executionGeminiEvaluation || undefined,
    }
}
