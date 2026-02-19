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

export interface MonthlyData {
    month: string
    pv: number
    cv: number
    cvr: number
}

export interface TrendChartProps {
    reportName: string
    weeklyResults: WeeklyResult[]
    monthlyTotal: {
        pv: number
        cv: number
        cvr: number
    }
    monthlyData?: MonthlyData[]
}
