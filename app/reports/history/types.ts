/** ページネーション情報 */
export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ReportExecution {
    id: number
    reportId: number
    reportName: string
    productName: string
    status: string
    startedAt: string | null
    completedAt: string | null
    createdAt: string
    hasResultData: boolean
    errorMessage: string | null
}
