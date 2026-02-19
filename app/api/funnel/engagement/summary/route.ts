import { NextResponse } from 'next/server'
import { getGeminiApiKey } from '@/lib/utils/gemini'
import { analyzeEngagementWithGemini } from '@/lib/api/gemini/engagementAnalysis'
import { createErrorResponse } from '@/lib/utils/error'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { engagementData, geminiApiKey: formApiKey } = body

        if (!engagementData?.rows || !Array.isArray(engagementData.rows)) {
            return NextResponse.json(
                { error: 'engagementData.rows (array) is required' },
                { status: 400 }
            )
        }

        const apiKey = getGeminiApiKey(formApiKey)
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini APIキーを設定してください（フォーム入力または環境変数 GEMINI_API_KEY）' },
                { status: 400 }
            )
        }

        const summary = await analyzeEngagementWithGemini(
            {
                startDate: engagementData.startDate ?? '',
                endDate: engagementData.endDate ?? '',
                rows: engagementData.rows,
            },
            apiKey
        )

        if (!summary) {
            return NextResponse.json(
                { error: 'AI分析の生成に失敗しました' },
                { status: 502 }
            )
        }

        return NextResponse.json({ success: true, summary })
    } catch (error) {
        console.error('Engagement summary API error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'AI分析の取得に失敗しました'),
            { status: 500 }
        )
    }
}
