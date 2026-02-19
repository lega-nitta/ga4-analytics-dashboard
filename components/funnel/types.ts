import type { FunnelStepData, Period } from '@/app/funnel/types'

export interface FunnelChartProps {
    data: FunnelStepData[]
    periodLabel?: string
    periods?: Array<{ label: string; data: FunnelStepData[] }>
    comparisonData?: FunnelStepData[]
    comparisonLabel?: string
}

export interface ConversionRateChartProps {
    data: FunnelStepData[]
    targetRate?: number
    periodLabel?: string
    periods?: Array<{ label: string; data: FunnelStepData[] }>
    comparisonData?: FunnelStepData[]
    comparisonLabel?: string
}

export interface DropoffRateChartProps {
    data: FunnelStepData[]
    periodLabel?: string
    periods?: Array<{ label: string; data: FunnelStepData[] }>
    comparisonData?: FunnelStepData[]
    comparisonLabel?: string
}

export interface ComparisonTableProps {
    comparison: {
        steps: Array<{
            stepName: string
            periods: { [key: string]: FunnelStepData }
            periodA?: FunnelStepData
            periodB?: FunnelStepData | null
            difference?: {
                users: number
                usersPercent: number
                conversionRate: number
                dropoffRate: number
            } | null
        }>
    }
    periods: Array<{
        label: string
        startDate: string
        endDate: string
    }>
    periodALabel?: string
    periodBLabel?: string
}

export interface ComparisonChartsProps {
    periods: Array<{
        label: string
        startDate: string
        endDate: string
        data: {
            steps: FunnelStepData[]
            totalUsers: number
        }
    }>
    periodA?: {
        label: string
        startDate: string
        endDate: string
        data: {
            steps: FunnelStepData[]
            totalUsers: number
        }
    }
    periodB?: {
        label: string
        startDate: string
        endDate: string
        data: {
            steps: FunnelStepData[]
            totalUsers: number
        }
    }
}

export interface PeriodSelectorProps {
    periods: Period[]
    onPeriodsChange: (periods: Period[]) => void
}
