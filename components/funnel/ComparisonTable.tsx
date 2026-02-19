'use client'

import React from 'react'
import styles from './ComparisonTable.module.css'
import type { ComparisonTableProps } from './types'

export default function ComparisonTable({
    comparison,
    periods,
    periodALabel,
    periodBLabel,
}: ComparisonTableProps) {
    const formatPercent = (value: number) => {
        return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`
    }

    const formatPt = (value: number) => {
        return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}pt`
    }

    const effectivePeriods = periods && periods.length > 0
        ? periods
        : (periodALabel && periodBLabel ? [
                { label: periodALabel },
                { label: periodBLabel }
            ] : [])

    const getPeriodData = (step: any, periodIndex: number) => {
        if (effectivePeriods.length > periodIndex) {
            const periodLabel = effectivePeriods[periodIndex].label
            return step.periods?.[periodLabel] || null
        }

        if (periodIndex === 0) return step.periodA || null
        if (periodIndex === 1) return step.periodB || null
        return null
    }

    const calculateDifference = (baseData: any, compareData: any) => {
        if (!baseData || !compareData) return null

        const usersDiff = compareData.users - baseData.users
        const usersPercent = baseData.users > 0 ? (usersDiff / baseData.users) * 100 : 0
        const conversionRateDiff = compareData.conversionRate - baseData.conversionRate
        const dropoffRateDiff = compareData.dropoffRate - baseData.dropoffRate

        return {
            users: usersDiff,
            usersPercent,
            conversionRate: conversionRateDiff,
            dropoffRate: dropoffRateDiff,
        }
    }

    if (effectivePeriods.length === 0) {
        return (
            <div className={styles.emptyState}>
                期間データがありません
            </div>
        )
    }

    const basePeriod = effectivePeriods[0]
    const comparisonPeriods = effectivePeriods.slice(1)

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headerRow}>
                        <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>
                            ステップ
                        </th>
                        {effectivePeriods.map((period, idx) => (
                            <th key={idx} colSpan={3} className={`${styles.headerCell} ${styles.headerCellCenter}`}>
                                {period.label}
                                {idx === 0 && effectivePeriods.length > 1 && (
                                    <span className={styles.baselineLabel}>(基準)</span>
                                )}
                            </th>
                        ))}
                        {comparisonPeriods.map((period, idx) => (
                            <th key={`diff-${idx}`} colSpan={3} className={`${styles.headerCell} ${styles.headerCellCenter}`}>
                                差分（{basePeriod.label} → {period.label}）
                            </th>
                        ))}
                    </tr>
                    <tr className={styles.headerRow}>
                        <th className={`${styles.subHeaderCell} ${styles.subHeaderCellLeft}`}></th>
                        {effectivePeriods.map((_, idx) => (
                            <React.Fragment key={idx}>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>ユーザー数</th>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>CVR</th>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>離脱率</th>
                            </React.Fragment>
                        ))}
                        {comparisonPeriods.map((_, idx) => (
                            <React.Fragment key={`diff-header-${idx}`}>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>ユーザー数</th>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>CVR</th>
                                <th className={`${styles.subHeaderCell} ${styles.subHeaderCellRight}`}>離脱率</th>
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {comparison.steps.map((step, index) => {
                        const baseData = getPeriodData(step, 0)

                        const differences = comparisonPeriods.map((_, periodIdx) => {
                            const compareData = getPeriodData(step, periodIdx + 1)
                            if (!baseData || !compareData) return null
                            return calculateDifference(baseData, compareData)
                        })

                        return (
                            <tr key={index} className={styles.bodyRow}>
                                <td className={`${styles.bodyCell} ${styles.bodyCellLeft} ${styles.bodyCellMedium}`}>
                                    {step.stepName}
                                </td>
                                {effectivePeriods.map((_, periodIdx) => {
                                    const periodData = getPeriodData(step, periodIdx)
                                    if (!periodData) {
                                        return (
                                            <React.Fragment key={periodIdx}>
                                                <td colSpan={3} className={`${styles.bodyCell} ${styles.bodyCellCenter} ${styles.emptyCell}`}>
                                                    データなし
                                                </td>
                                            </React.Fragment>
                                        )
                                    }
                                    return (
                                        <React.Fragment key={periodIdx}>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight}`}>
                                                {periodData.users.toLocaleString()}
                                            </td>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight}`}>
                                                {(periodData.conversionRate * 100).toFixed(2)}%
                                            </td>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight}`}>
                                                {(periodData.dropoffRate * 100).toFixed(2)}%
                                            </td>
                                        </React.Fragment>
                                    )
                                })}
                                {differences.map((difference, diffIdx) => {
                                    if (!difference) {
                                        return (
                                            <React.Fragment key={`diff-${diffIdx}`}>
                                                <td colSpan={3} className={`${styles.bodyCell} ${styles.bodyCellCenter} ${styles.emptyCell}`}>
                                                    -
                                                </td>
                                            </React.Fragment>
                                        )
                                    }
                                    return (
                                        <React.Fragment key={`diff-${diffIdx}`}>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight} ${
                                                difference.users >= 0 ? styles.positiveValue : styles.negativeValue
                                            }`}>
                                                {difference.users >= 0 ? '↑' : '↓'} {difference.users >= 0 ? '+' : ''}{difference.users.toLocaleString()}
                                                <br />
                                                <span className={styles.unitText}>
                                                    ({formatPercent(difference.usersPercent)})
                                                </span>
                                            </td>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight} ${
                                                difference.conversionRate >= 0 ? styles.positiveValue : styles.negativeValue
                                            }`}>
                                                {difference.conversionRate >= 0 ? '↑' : '↓'} {formatPt(difference.conversionRate)}
                                            </td>
                                            <td className={`${styles.bodyCell} ${styles.bodyCellRight} ${
                                                difference.dropoffRate <= 0 ? styles.positiveValue : styles.negativeValue
                                            }`}>
                                                {difference.dropoffRate <= 0 ? '↓' : '↑'} {formatPt(difference.dropoffRate)}
                                            </td>
                                        </React.Fragment>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
