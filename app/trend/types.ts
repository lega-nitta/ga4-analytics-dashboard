export interface Report {
    id: number
    name: string
    reportType: string
    executionMode: string | null
    isActive: boolean
    productId: number
    productName: string
    createdAt: string
    updatedAt: string
    cvrA: {
        denominatorLabels: string[]
        numeratorLabels: string[]
    } | null
}

export interface WeeklyResult {
    period: string
    startDate: string
    endDate: string
    dataA: {
        pv: number
        cv: number
        cvr: number
    }
    error?: string
}

export interface TrendData {
    reportId: number
    reportName: string
    month: string
    cvrConfig: {
        denominatorLabels: string[]
        numeratorLabels: string[]
    }
    weeklyResults: WeeklyResult[]
    monthlyTotal: {
        pv: number
        cv: number
        cvr: number
    }
}
