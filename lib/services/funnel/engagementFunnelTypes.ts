/**
 * エンゲージメントファネル用の型と定数（クライアントから参照可能）
 * サーバー専用のGA4呼び出しは engagementFunnelService に分離
 */

export const ENGAGEMENT_MILESTONES = [
    '10秒以上滞在',
    '30秒以上滞在',
    '60秒以上滞在',
    '120秒以上滞在',
    '180秒以上滞在',
] as const

export type EngagementMilestone = (typeof ENGAGEMENT_MILESTONES)[number]

export interface EngagementMilestoneData {
    users: number
    events: number
}

export interface EngagementFunnelRow {
    pagePath: string
    baseUsers: number
    baseEvents: number
    milestones: Record<EngagementMilestone, EngagementMilestoneData>
    rates: Record<string, number>
}

export interface EngagementFunnelData {
    startDate: string
    endDate: string
    rows: EngagementFunnelRow[]
}
