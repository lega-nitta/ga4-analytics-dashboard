import { NextResponse } from 'next/server'
import { getNextExecutionDate } from '@/lib/services/ab-test/scheduleService'

/**
 * ABテストの次回実行予定日時を取得
 */
export async function GET(
    _request: Request,
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

        const nextDate = await getNextExecutionDate(id)

        return NextResponse.json({
            success: true,
            nextExecutionDate: nextDate ? nextDate.toISOString() : null,
        })
    } catch (error) {
        console.error('Next Execution Date API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to get next execution date',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
