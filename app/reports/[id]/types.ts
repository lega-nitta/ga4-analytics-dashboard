export interface ReportDetail {
    id: number
    reportId: number
    report: {
        id: number
        name: string
        reportType: string
        config: any
        product: {
            id: number
            name: string
        } | null
    }
    status: string
    startedAt: string | null
    completedAt: string | null
    createdAt: string
    resultData: any
    errorMessage: string | null
}
