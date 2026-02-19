/**
 * レポート一覧取得API
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { createErrorResponse } from '@/lib/utils/error'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        const isActive = searchParams.get('isActive')

        const where: any = {}

        if (productId) {
            where.productId = parseInt(productId, 10)
        }

        if (isActive !== null) {
            where.isActive = isActive === 'true'
        }

        const reports = await prisma.report.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return NextResponse.json({
            success: true,
            reports: reports.map((report) => {
                const config = report.config as any
                const cvrA = config?.cvrA || null
                
                return {
                    id: report.id,
                    name: report.name,
                    reportType: report.reportType,
                    executionMode: report.executionMode,
                    isActive: report.isActive,
                    productId: report.productId,
                    productName: report.product?.name || 'N/A',
                    createdAt: report.createdAt,
                    updatedAt: report.updatedAt,
                    cvrA: cvrA ? {
                        denominatorLabels: Array.isArray(cvrA.denominatorLabels) 
                            ? cvrA.denominatorLabels 
                            : (cvrA.denominatorLabels || '').split(',').map((l: string) => l.trim()).filter(Boolean),
                        numeratorLabels: Array.isArray(cvrA.numeratorLabels) 
                            ? cvrA.numeratorLabels 
                            : (cvrA.numeratorLabels || '').split(',').map((l: string) => l.trim()).filter(Boolean),
                    } : null,
                }
            }),
        })
    } catch (error) {
        console.error('Reports API Error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'Failed to fetch reports'),
            { status: 500 }
        )
    }
}
