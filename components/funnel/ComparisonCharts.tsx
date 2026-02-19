'use client'

import FunnelChart from './FunnelChart'
import ConversionRateChart from './ConversionRateChart'
import DropoffRateChart from './DropoffRateChart'
import styles from './ComparisonCharts.module.css'
import type { ComparisonChartsProps } from './types'

export default function ComparisonCharts({ periods, periodA, periodB }: ComparisonChartsProps) {
    const effectivePeriods = periods && periods.length > 0 
        ? periods 
        : (periodA && periodB ? [periodA, periodB] : [])

    if (effectivePeriods.length === 0 || !effectivePeriods.some(p => p?.data?.steps)) {
        return (
            <div className={styles.emptyState}>
                データがありません
            </div>
        )
    }

    const basePeriod = effectivePeriods[0]

    const periodsForCharts = effectivePeriods.map(period => ({
        label: period.label,
        data: period.data.steps
    }))

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>ファネルチャート比較</h2>
                {effectivePeriods.length > 1 ? (
                    <FunnelChart
                        data={basePeriod.data.steps}
                        periods={periodsForCharts}
                    />
                ) : (
                    <FunnelChart
                        data={basePeriod.data.steps}
                        periodLabel={basePeriod.label}
                    />
                )}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>コンバージョン率比較</h2>
                {effectivePeriods.length > 1 ? (
                    <ConversionRateChart
                        data={basePeriod.data.steps}
                        periods={periodsForCharts}
                    />
                ) : (
                    <ConversionRateChart
                        data={basePeriod.data.steps}
                        periodLabel={basePeriod.label}
                    />
                )}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>ドロップオフ率比較</h2>
                {effectivePeriods.length > 1 ? (
                    <DropoffRateChart
                        data={basePeriod.data.steps}
                        periods={periodsForCharts}
                    />
                ) : (
                    <DropoffRateChart
                        data={basePeriod.data.steps}
                        periodLabel={basePeriod.label}
                    />
                )}
            </div>
        </div>
    )
}
