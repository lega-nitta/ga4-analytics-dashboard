'use client'

import type { PeriodSelectorProps } from '../types'
import styles from './PeriodSelector.module.css'

export default function PeriodSelector({
    periods,
    selectedPeriod,
    onPeriodSelect,
    comparisonData,
}: PeriodSelectorProps) {
    return (
        <div className={styles.container}>
            <p className={styles.label}>表示する期間を選択</p>
            <div className={styles.buttonGroup}>
                {periods.map((period, index) => (
                    <button
                        key={index}
                        onClick={() => onPeriodSelect(index.toString())}
                        className={`${styles.button} ${
                            selectedPeriod === index.toString()
                                ? styles.buttonActive
                                : styles.buttonInactive
                        }`}
                    >
                        {period.label}
                    </button>
                ))}
                {comparisonData?.periodA && !periods.some(p => p.label === comparisonData.periodA?.label) && (
                    <button
                        onClick={() => onPeriodSelect('A')}
                        className={`${styles.button} ${
                            selectedPeriod === 'A'
                                ? styles.buttonActive
                                : styles.buttonInactive
                        }`}
                    >
                        {comparisonData.periodA.label}
                    </button>
                )}
                {comparisonData?.periodB && !periods.some(p => p.label === comparisonData.periodB?.label) && (
                    <button
                        onClick={() => onPeriodSelect('B')}
                        className={`${styles.button} ${
                            selectedPeriod === 'B'
                                ? styles.buttonActive
                                : styles.buttonInactive
                        }`}
                    >
                        {comparisonData.periodB.label}
                    </button>
                )}
            </div>
        </div>
    )
}
