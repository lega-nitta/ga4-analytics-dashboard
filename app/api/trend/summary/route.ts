import { NextResponse } from 'next/server'
import { getGeminiApiKey } from '@/lib/utils/gemini'
import { analyzeTrendWithGemini } from '@/lib/api/gemini/trendAnalysis'
import { createErrorResponse } from '@/lib/utils/error'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { trendData, startMonth, endMonth, geminiApiKey: formApiKey } = body

        if (!trendData || !Array.isArray(trendData) || trendData.length === 0) {
            return NextResponse.json(
                { error: 'trendData (non-empty array) is required' },
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

        const summary = await analyzeTrendWithGemini(
            {
                trendData,
                startMonth: startMonth ?? trendData[0]?.month ?? '',
                endMonth: endMonth ?? trendData[trendData.length - 1]?.month ?? '',
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
        console.error('Trend summary API error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'AI分析の取得に失敗しました'),
            { status: 500 }
        )
    }
}
