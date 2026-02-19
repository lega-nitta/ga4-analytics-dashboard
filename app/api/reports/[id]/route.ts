/**
 * レポート詳細取得API
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Next.js 15ではparamsがPromiseの場合がある
        const resolvedParams = params instanceof Promise ? await params : params
        const executionId = parseInt(resolvedParams.id, 10)

        if (isNaN(executionId)) {
            return NextResponse.json(
                { error: 'Invalid execution ID' },
                { status: 400 }
            )
        }

        const execution = await prisma.reportExecution.findUnique({
            where: {
                id: executionId,
            },
            include: {
                report: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!execution) {
            return NextResponse.json(
                { error: 'Report execution not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            execution: {
                id: execution.id,
                reportId: execution.reportId,
                report: execution.report
                    ? {
                            id: execution.report.id,
                            name: execution.report.name,
                            reportType: execution.report.reportType,
                            config: execution.report.config,
                            executionMode: execution.report.executionMode,
                            product: execution.report.product
                                ? {
                                        id: execution.report.product.id,
                                        name: execution.report.product.name,
                                    }
                                : null,
                        }
                    : null,
                status: execution.status,
                startedAt: execution.startedAt,
                completedAt: execution.completedAt,
                createdAt: execution.createdAt,
                resultData: execution.resultData,
                errorMessage: execution.errorMessage,
            },
        })
    } catch (error) {
        console.error('Report Detail API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : undefined
        console.error('Report Detail API Error Details:', { message: errorMessage, stack: errorStack })
        
        return NextResponse.json(
            {
                error: 'Failed to fetch report detail',
                message: errorMessage,
                ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
            },
            { status: 500 }
        )
    }
}
