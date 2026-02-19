import type { FunnelExecution } from '@/app/funnel/types'

export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface FunnelExecutionListItem extends Omit<FunnelExecution, 'funnelConfig' | 'filterConfig' | 'resultData' | 'geminiEvaluation' | 'errorMessage'> {
    hasResultData: boolean
}
