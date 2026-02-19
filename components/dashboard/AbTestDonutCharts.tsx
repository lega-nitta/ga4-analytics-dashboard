'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { AbTestCompletedOutcome, AbTestCountByStatus } from '@/app/dashboard/types'
import styles from './AbTestDonutCharts.module.css'

const STATUS_COLORS = {
    running: '#16a34a',
    paused: '#f59e0b',
    completed: '#6366f1',
} as const

const OUTCOME_COLORS = {
    victory: '#0891b2',
    defeat: '#dc2626',
} as const

interface AbTestDonutChartsProps {
    countByStatus: AbTestCountByStatus
    completedOutcome: AbTestCompletedOutcome
}

function DonutStatus({ countByStatus }: { countByStatus: AbTestCountByStatus }) {
    const total = countByStatus.running + countByStatus.paused + countByStatus.completed
    const data = [
        { name: '実行中', value: countByStatus.running, key: 'running' as const },
        { name: '一時停止', value: countByStatus.paused, key: 'paused' as const },
        { name: '完了', value: countByStatus.completed, key: 'completed' as const },
    ].filter((d) => d.value > 0)

    if (total === 0) {
        return (
            <div className={styles.chartWrap}>
                <h3 className={styles.chartTitle}>AB施策の状態</h3>
                <div className={styles.emptyMessage}>データがありません</div>
            </div>
        )
    }

    return (
        <div className={styles.chartWrap}>
            <h3 className={styles.chartTitle}>AB施策の状態</h3>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        label={({ name, value }) => `${name} ${value}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, '件']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

function DonutOutcome({ completedOutcome }: { completedOutcome: AbTestCompletedOutcome }) {
    const total = completedOutcome.victory + completedOutcome.defeat
    const data = [
        { name: '勝利（B/C/D）', value: completedOutcome.victory, key: 'victory' as const },
        { name: '負け（A）', value: completedOutcome.defeat, key: 'defeat' as const },
    ].filter((d) => d.value > 0)

    if (total === 0) {
        return (
            <div className={styles.chartWrap}>
                <h3 className={styles.chartTitle}>完了の内訳</h3>
                <div className={styles.emptyMessage}>完了した施策がありません</div>
            </div>
        )
    }

    return (
        <div className={styles.chartWrap}>
            <h3 className={styles.chartTitle}>完了の内訳</h3>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        label={({ name, value }) => `${name} ${value}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={entry.key} fill={OUTCOME_COLORS[entry.key]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, '件']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default function AbTestDonutCharts({ countByStatus, completedOutcome }: AbTestDonutChartsProps) {
    return (
        <div className={styles.container}>
            <DonutStatus countByStatus={countByStatus} />
            <DonutOutcome completedOutcome={completedOutcome} />
        </div>
    )
}
