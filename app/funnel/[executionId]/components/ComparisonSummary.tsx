'use client'

import type { ComparisonSummaryProps } from '../types'
import styles from './ComparisonSummary.module.css'

export default function ComparisonSummary({ periods }: ComparisonSummaryProps) {
    if (periods.length === 0) return null

    const getGridCols = (count: number) => {
        if (count <= 4) return styles.gridCols4
        if (count <= 6) return styles.gridCols6
        return styles.gridCols8
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>期間比較サマリー</h2>
            <div className={styles.content}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>総エントリー数</h3>
                    <div className={`${styles.grid} ${getGridCols(periods.length)}`}>
                        {periods.map((period, index) => (
                            <div key={index} className={styles.card}>
                                <p className={styles.cardLabel}>
                                    {period.label}
                                    {index === 0 && periods.length > 1 && (
                                        <span className={styles.baseline}>(基準)</span>
                                    )}
                                </p>
                                <p className={`${styles.cardValue} ${styles.cardValueBlue}`}>
                                    {period.data.totalUsers.toLocaleString()} 人
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {periods.length > 1 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            エントリー数差分（{periods[0].label} 基準）
                        </h3>
                        <div className={`${styles.grid} ${getGridCols(periods.length - 1)}`}>
                            {periods.slice(1).map((period, index) => {
                                const usersDiff = period.data.totalUsers - periods[0].data.totalUsers
                                const usersPercent = periods[0].data.totalUsers > 0 
                                    ? ((usersDiff / periods[0].data.totalUsers) * 100).toFixed(2)
                                    : '0.00'
                                return (
                                    <div key={index} className={styles.card}>
                                        <p className={styles.cardLabel}>
                                            {period.label}
                                        </p>
                                        <p className={`${styles.cardValue} ${
                                            usersDiff >= 0
                                                ? styles.cardValueGreen
                                                : styles.cardValueRed
                                        }`}>
                                            {usersDiff >= 0 ? '+' : ''}{usersDiff.toLocaleString()} 人
                                        </p>
                                        <p className={styles.cardSubtext}>
                                            ({usersDiff >= 0 ? '+' : ''}{usersPercent}%)
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>全体コンバージョン率</h3>
                    <div className={`${styles.grid} ${getGridCols(periods.length)}`}>
                        {periods.map((period, index) => {
                            const finalCVR = period.data.steps[period.data.steps.length - 1]?.conversionRate || 0
                            return (
                                <div key={index} className={styles.card}>
                                    <p className={styles.cardLabel}>
                                        {period.label}
                                        {index === 0 && periods.length > 1 && (
                                            <span className={styles.baseline}>(基準)</span>
                                        )}
                                    </p>
                                    <p className={`${styles.cardValue} ${styles.cardValuePurple}`}>
                                        {(finalCVR * 100).toFixed(2)}%
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {periods.length > 1 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            全体CVR差分（{periods[0].label} 基準）
                        </h3>
                        <div className={`${styles.grid} ${getGridCols(periods.length - 1)}`}>
                            {periods.slice(1).map((period, index) => {
                                const baseCVR = periods[0].data.steps[periods[0].data.steps.length - 1]?.conversionRate || 0
                                const periodCVR = period.data.steps[period.data.steps.length - 1]?.conversionRate || 0
                                const cvrDiff = (periodCVR - baseCVR) * 100
                                return (
                                    <div key={index} className={styles.card}>
                                        <p className={styles.cardLabel}>
                                            {period.label}
                                        </p>
                                        <p className={`${styles.cardValue} ${
                                            cvrDiff >= 0
                                                ? styles.cardValueGreen
                                                : styles.cardValueRed
                                        }`}>
                                            {cvrDiff >= 0 ? '+' : ''}{cvrDiff.toFixed(2)}pt
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
