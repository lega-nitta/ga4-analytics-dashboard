import { NextResponse } from 'next/server'
import { getGA4AccessToken } from '@/lib/api/ga4/client'

/**
 * GA4メタデータAPIエンドポイント
 * プロダクトのGA4プロパティから利用可能なメトリクスとディメンションを取得
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const propertyId = searchParams.get('propertyId')

        if (!propertyId) {
            return NextResponse.json(
                { error: 'propertyId is required' },
                { status: 400 }
            )
        }

        const accessToken = await getGA4AccessToken()

        const metadataResponse = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}/metadata`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!metadataResponse.ok) {
            const error = await metadataResponse.json()
            throw new Error(`GA4 Metadata API Error: ${error.error?.message || metadataResponse.statusText}`)
        }

        const metadata = await metadataResponse.json()

        return NextResponse.json({
            metrics: metadata.metrics || [],
            dimensions: metadata.dimensions || [],
        })
    } catch (error) {
        console.error('GA4 Metadata API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to fetch GA4 metadata',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
