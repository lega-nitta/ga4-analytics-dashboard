/**
 * ABテスト評価サービス
 * 元のGASコードのevaluateAbTestResult関数を参考に実装
 */

import { calculateStatisticalSignificance, getRequiredSignificanceByHybrid, getPeriodReliabilityLevel } from './statisticalService'
import { calculateDaysBetween } from '@/lib/utils/date'

export interface AbTestVariant {
    name: string
    data: {
        pv: number
        cv: number
        cvr: number
    }
}

export interface AbTestEvaluationConfig {
    minSignificance?: number | null
    minPV?: number
    minDays?: number
    minImprovementRate?: number
    minDifferencePt?: number
}

export interface AbTestEvaluation {
    allPassed: boolean
    checks: {
        significance: {
            passed: boolean
            value: number
            zScore: string
            required: number
            periodBased: number
            cvBased: number
            pvBased: number
        }
        sampleSize: {
            passed: boolean
            winnerPV: number
            runnerUpPV: number
            winnerCV: number
            runnerUpCV: number
            minRequiredPV: number
            aPV?: number
            bPV?: number
            cPV?: number
            dPV?: number
        }
        period: {
            passed: boolean
            days: number
            minRequired: number
            reliabilityLevel: string
            reliabilityIcon: string
            reliabilityDescription: string
        }
        improvement: {
            passed: boolean
            improvementRate: number
            differencePt: number
            minImprovementRate: number
            minDifferencePt: number
        }
    }
    recommendation: string
    aiEvaluation?: string
}

/**
 * ABテスト結果を評価
 * 統計的有意差、サンプルサイズ、テスト期間、改善率をチェックし、総合判定を行う
 * @param winner - 勝利バリアント（CVRが最も高い）
 * @param runnerUp - 2位バリアント
 * @param startDate - テスト開始日（YYYY-MM-DD形式）
 * @param endDate - テスト終了日（YYYY-MM-DD形式）
 * @param config - 評価設定（最小有意差、最小PV数、最小日数、最小改善率など）
 * @param allVariants - すべてのバリアント（Aが含まれる場合、Aをベースラインとして扱う）
 * @returns 評価結果（各チェックの結果と総合判定）
 */
export function evaluateAbTestResult(
    winner: AbTestVariant,
    runnerUp: AbTestVariant,
    startDate: string,
    endDate: string,
    config: AbTestEvaluationConfig = {},
    allVariants?: AbTestVariant[]
): AbTestEvaluation {
    const {
        minSignificance = null,
        minPV = 1000,
        minDays = 14,
        minImprovementRate = 5,
        minDifferencePt = 0.5,
    } = config

    const daysDiff = calculateDaysBetween(startDate, endDate)

    // ハイブリッド方式で有意差の基準値を計算
    const significanceConfig =
        minSignificance !== null
            ? {
                    required: minSignificance,
                    periodBased: minSignificance,
                    cvBased: minSignificance,
                    pvBased: minSignificance,
                }
            : getRequiredSignificanceByHybrid(
                    daysDiff,
                    winner.data.cv,
                    runnerUp.data.cv,
                    winner.data.pv,
                    runnerUp.data.pv
                )

    const stats = calculateStatisticalSignificance(
        winner.data.cv,
        winner.data.pv,
        runnerUp.data.cv,
        runnerUp.data.pv
    )

    // Aがオリジナル（ベースライン）かどうかを確認
    const isAOriginal = winner.name === 'A'
    const baselineVariant = allVariants?.find(v => v.name === 'A')

    const checks = {
        significance: {
            passed: stats.significance >= significanceConfig.required,
            value: stats.significance,
            zScore: stats.zScore.toFixed(3),
            required: significanceConfig.required,
            periodBased: significanceConfig.periodBased,
            cvBased: significanceConfig.cvBased,
            pvBased: significanceConfig.pvBased,
        },
        sampleSize: (() => {
            const aVariant = allVariants?.find(v => v.name === 'A')
            const bVariant = allVariants?.find(v => v.name === 'B')
            const cVariant = allVariants?.find(v => v.name === 'C')
            const dVariant = allVariants?.find(v => v.name === 'D')
            
            return {
                passed: winner.data.pv >= minPV && runnerUp.data.pv >= minPV,
                winnerPV: winner.data.pv,
                runnerUpPV: runnerUp.data.pv,
                winnerCV: winner.data.cv,
                runnerUpCV: runnerUp.data.cv,
                minRequiredPV: minPV,
                aPV: aVariant?.data.pv,
                bPV: bVariant?.data.pv,
                cPV: cVariant?.data.pv,
                dPV: dVariant?.data.pv,
            }
        })(),
        period: (() => {
            const periodReliability = getPeriodReliabilityLevel(daysDiff);
            return {
                passed: daysDiff >= minDays,
                days: daysDiff,
                minRequired: minDays,
                reliabilityLevel: periodReliability.level,
                reliabilityIcon: periodReliability.icon,
                reliabilityDescription: periodReliability.description,
            }
        })(),
        improvement: (() => {
            // Aがオリジナル（ベースライン）の場合、Aが勝っている = 改善なし
            if (isAOriginal && baselineVariant) {
                const improvementRate = -100
                const differencePt = (winner.data.cvr - runnerUp.data.cvr) * 100
                
                return {
                    passed: false,
                    improvementRate,
                    differencePt,
                    minImprovementRate,
                    minDifferencePt,
                }
            }
            
            // バリアント（B/C/D）がAより良い場合の改善率計算
            const baseline = baselineVariant || runnerUp
            const variant = isAOriginal ? runnerUp : winner
            
            const improvementRate =
                baseline.data.cv > 0 && baseline.data.pv > 0
                    ? ((variant.data.cv / variant.data.pv) - (baseline.data.cv / baseline.data.pv)) / (baseline.data.cv / baseline.data.pv) * 100
                    : 0
            const differencePt = 
                ((variant.data.cv / variant.data.pv) - (baseline.data.cv / baseline.data.pv)) * 100
            
            return {
                passed: improvementRate >= minImprovementRate || differencePt >= minDifferencePt,
                improvementRate,
                differencePt,
                minImprovementRate,
                minDifferencePt,
            }
        })(),
    }

    const allPassed =
        checks.significance.passed &&
        checks.sampleSize.passed &&
        checks.period.passed &&
        checks.improvement.passed

    // Aがオリジナル（ベースライン）の場合、Aが勝っている = 改善なし
    if (isAOriginal) {
        return {
            allPassed: false, // Aが勝っている場合は改善なし
            checks,
            recommendation: `❌ ${winner.name}が上回っています。${runnerUp.name}は${winner.name}を上回っていません。`,
        }
    }

    return {
        allPassed,
        checks,
        recommendation: allPassed
            ? `✅ ${winner.name}の勝利が統計的に確認されました。${baselineVariant ? `${baselineVariant.name}より改善されています。` : ''}`
            : `⚠️ ${winner.name}が上回っていますが、判定基準を満たしていません。`,
    }
}
