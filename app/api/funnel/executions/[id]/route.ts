/**
 * ファネル実行履歴詳細API
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(
    request: Request,
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

        const execution = await prisma.funnelExecution.findUnique({
            where: { id: executionId },
            include: {
                product: true,
            },
        })

        if (!execution) {
            return NextResponse.json(
                { error: 'Funnel execution not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            execution: {
                id: execution.id,
                productId: execution.productId,
                productName: execution.product?.name || 'N/A',
                name: execution.name,
                funnelConfig: execution.funnelConfig,
                filterConfig: execution.filterConfig,
                startDate: execution.startDate,
                endDate: execution.endDate,
                resultData: execution.resultData,
                geminiEvaluation: execution.geminiEvaluation,
                status: execution.status,
                errorMessage: execution.errorMessage,
                createdAt: execution.createdAt,
            },
        })
    } catch (error) {
        console.error('Funnel Execution Detail API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to fetch funnel execution',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
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

        await prisma.funnelExecution.delete({
            where: { id: executionId },
        })

        return NextResponse.json({ success: true, message: 'ファネル実行履歴を削除しました' })
    } catch (error) {
        console.error('Delete Funnel Execution API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to delete funnel execution',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
