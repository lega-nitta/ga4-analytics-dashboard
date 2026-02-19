/**
 * レポート実行履歴削除API
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = params instanceof Promise ? await params : params
        const executionId = parseInt(resolvedParams.id, 10)

        if (isNaN(executionId)) {
            return NextResponse.json(
                { error: 'Invalid execution ID' },
                { status: 400 }
            )
        }

        await prisma.reportExecution.delete({
            where: {
                id: executionId,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'レポート実行履歴を削除しました',
        })
    } catch (error) {
        console.error('Delete Report Execution API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to delete report execution',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
