import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

function getWinnerFromResultData(resultData: unknown): string | null {
    const data = resultData as { cvrResults?: Record<string, { cvr: number }> } | null
    if (!data?.cvrResults) return null
    const cvrResults = data.cvrResults
    const variants = [
        cvrResults.dataA && { name: 'A', cvr: cvrResults.dataA.cvr },
        cvrResults.dataB && { name: 'B', cvr: cvrResults.dataB.cvr },
        cvrResults.dataC && { name: 'C', cvr: cvrResults.dataC.cvr },
        cvrResults.dataD && { name: 'D', cvr: cvrResults.dataD.cvr },
    ].filter(Boolean) as Array<{ name: string; cvr: number }>
    if (variants.length < 2) return null
    variants.sort((a, b) => b.cvr - a.cvr)
    return variants[0].name
}

/**
 * ABテスト詳細を取得
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = params instanceof Promise ? await params : params
        const id = parseInt(resolvedParams.id, 10)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            )
        }

        const abTest = await prisma.abTest.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                reportExecutions: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (!abTest) {
            return NextResponse.json(
                { error: 'AB test not found' },
                { status: 404 }
            )
        }

        let winnerFromLastRun: string | null = null
        const lastCompleted = await prisma.abTestReportExecution.findFirst({
            where: { abTestId: id, status: 'completed' },
            orderBy: { completedAt: 'desc' },
            select: { resultData: true },
        })
        if (lastCompleted?.resultData) {
            winnerFromLastRun = getWinnerFromResultData(lastCompleted.resultData)
        }

        return NextResponse.json({
            success: true,
            abTest,
            reportExecutions: abTest.reportExecutions,
            winnerFromLastRun,
        })
    } catch (error) {
        console.error('AB Test Detail API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to fetch AB test detail',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
