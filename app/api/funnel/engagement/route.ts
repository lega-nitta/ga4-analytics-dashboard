/**
 * エンゲージメントファネル分析API
 * 元のGASコードのcreateEngagementFunnelReportを参考に実装
 * ページごと・滞在時間（time_on_page）のファネルを集計
 */

import { NextResponse } from 'next/server'
import { fetchEngagementFunnelData } from '@/lib/services/funnel/engagementFunnelService'
import { getGA4AccessToken } from '@/lib/api/ga4/client'
import { createErrorResponse } from '@/lib/utils/error'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { propertyId, startDate, endDate, accessToken: customToken } = body

        if (!propertyId) {
            return NextResponse.json(
                { error: 'propertyId is required' },
                { status: 400 }
            )
        }

        const accessToken = await getGA4AccessToken(customToken)

        const data = await fetchEngagementFunnelData(
            propertyId,
            startDate || '28daysAgo',
            endDate || 'yesterday',
            accessToken
        )

        return NextResponse.json({
            success: true,
            data: {
                startDate: data.startDate,
                endDate: data.endDate,
                rows: data.rows,
            },
        })
    } catch (error) {
        console.error('Engagement funnel API error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'エンゲージメントファネルの取得に失敗しました'),
            { status: 500 }
        )
    }
}
