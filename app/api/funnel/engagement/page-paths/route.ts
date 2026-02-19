/**
 * エンゲージメントファネルで取得しているページパス一覧を返す
 * ダッシュボードのページ選択などで利用
 */

import { NextResponse } from 'next/server'
import { fetchEngagementFunnelData } from '@/lib/services/funnel/engagementFunnelService'
import { getGA4AccessToken } from '@/lib/api/ga4/client'
import { createErrorResponse } from '@/lib/utils/error'

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
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

        const pagePaths = data.rows.map((r) => r.pagePath).filter(Boolean)

        return NextResponse.json({
            success: true,
            pagePaths,
            startDate: data.startDate,
            endDate: data.endDate,
        })
    } catch (error) {
        console.error('Engagement page-paths API error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'ページパス一覧の取得に失敗しました'),
            { status: 500 }
        )
    }
}
