/**
 * レポートの実行モードを更新するAPI
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { createErrorResponse } from '@/lib/utils/error'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = params instanceof Promise ? await params : params
        const reportId = parseInt(resolvedParams.id, 10)

        if (isNaN(reportId)) {
            return NextResponse.json(
                { error: 'Invalid report ID' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { executionMode } = body

        if (executionMode !== null && executionMode !== 'trend') {
            return NextResponse.json(
                { error: 'executionMode must be "trend" or null' },
                { status: 400 }
            )
        }

        const report = await prisma.report.update({
            where: { id: reportId },
            data: {
                executionMode: executionMode || null,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                name: report.name,
                executionMode: report.executionMode,
            },
        })
    } catch (error) {
        console.error('Update Report Execution Mode API Error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'Failed to update report execution mode'),
            { status: 500 }
        )
    }
}
