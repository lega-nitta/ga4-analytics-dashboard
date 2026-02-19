import type {
    FunnelData,
    ComparisonData,
    FunnelExecution,
} from '@/app/funnel/types'

export type { FunnelData, ComparisonData, FunnelExecution }

export type ViewMode = 'single' | 'compare'

export interface PageProps {
    execution: FunnelExecution
    comparisonData: ComparisonData | null
    funnelData: FunnelData | null
    periods: Array<{
        label: string
        startDate: string
        endDate: string
        data: FunnelData
    }>
    periodFunnelDataMap: { [key: string]: FunnelData }
    displaySingleData: FunnelData | null
}

export interface SummaryCardProps {
    label: string
    value: string | number
    isBase?: boolean
    variant?: 'default' | 'positive' | 'negative'
}

export interface PeriodLabel {
    label: string
}

export interface ComparisonPeriod {
    label: string
    data: {
        totalUsers: number
        steps: Array<{ conversionRate: number }>
    }
}

export interface ComparisonSummaryProps {
    periods: ComparisonPeriod[]
}

export interface PeriodSelectorProps {
    periods: PeriodLabel[]
    selectedPeriod: string
    onPeriodSelect: (period: string) => void
    comparisonData?: {
        periodA?: { label: string }
        periodB?: { label: string }
    }
}

export interface ViewModeTabsProps {
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
}
