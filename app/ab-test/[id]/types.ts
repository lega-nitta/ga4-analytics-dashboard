export interface AbTestScheduleConfig {
    enabled: boolean
    executionType: 'on_end' | 'on_end_delayed' | 'scheduled' | 'recurring'
    delayDays?: number
    scheduledDate?: string
    recurringPattern?: {
        frequency: 'daily' | 'weekly' | 'monthly'
        time: string
        daysOfWeek?: number[]
        dayOfMonth?: number
    }
}

export interface AbTest {
    id: number
    name: string
    description: string | null
    startDate: string
    endDate: string | null
    status: string
    winnerVariant?: string | null
    ga4Config?: {
        cvrC?: { denominatorDimension?: string }
        cvrD?: { denominatorDimension?: string }
    }
    autoExecute?: boolean
    scheduleConfig?: AbTestScheduleConfig | null
    lastExecutedAt?: string | null
    victoryFactors?: string | null
    defeatFactors?: string | null
    product: {
        id: number
        name: string
    }
}

export interface AbTestReportExecution {
    id: number
    abTestId: number
    reportExecutionId: number | null
    status: string
    startedAt: string | null
    completedAt: string | null
    errorMessage: string | null
    createdAt: string
}
