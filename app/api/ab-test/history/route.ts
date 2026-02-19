import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

/**
 * ABテスト実行履歴一覧を取得
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        const search = searchParams.get('search') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit

        const where: any = {}
        
        if (productId && search) {
            where.abTest = {
                productId: parseInt(productId, 10),
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        product: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            }
        } else if (productId) {
            where.abTest = {
                productId: parseInt(productId, 10),
            }
        } else if (search) {
            where.OR = [
                {
                    abTest: {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    abTest: {
                        product: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            ]
        }

        const [executions, total] = await Promise.all([
            prisma.abTestReportExecution.findMany({
                where,
                include: {
                    abTest: {
                        select: {
                            id: true,
                            name: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    reportExecution: {
                        select: {
                            id: true,
                            status: true,
                            resultData: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.abTestReportExecution.count({ where }),
        ])

        const formattedExecutions = executions.map((exec) => ({
            id: exec.id,
            abTestId: exec.abTestId,
            abTestName: exec.abTest.name,
            productName: exec.abTest.product.name,
            reportExecutionId: exec.reportExecutionId,
            status: exec.status,
            startedAt: exec.startedAt,
            completedAt: exec.completedAt,
            createdAt: exec.createdAt,
            hasResultData: !!exec.reportExecution?.resultData,
            errorMessage: exec.errorMessage,
        }))

        return NextResponse.json({
            success: true,
            executions: formattedExecutions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('AB Test History API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to fetch AB test history',
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
