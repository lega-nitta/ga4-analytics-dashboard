/**
 * 月次トレンドレポート生成API
 */

import { NextResponse } from 'next/server'
import { fetchGA4Data, getGA4AccessToken } from '@/lib/api/ga4/client'
import { calculateCVR } from '@/lib/services/analytics/cvrService'
import { getWeeklyRangesForMonth } from '@/lib/utils/date'
import { prisma } from '@/lib/db/client'
import { createErrorResponse } from '@/lib/utils/error'

/**
 * レポート行を集計（同じディメンション値の行を合計）
 */
function aggregateReportRows(rows: any[]): any[] {
    const aggregated = new Map<string, any>()

    for (const row of rows) {
        const key = row.dimensionValues.map((dv: any) => dv.value).join('|')
        if (!aggregated.has(key)) {
            aggregated.set(key, {
                dimensionValues: row.dimensionValues,
                metricValues: row.metricValues.map((mv: any) => ({ value: '0' })),
            })
        }
        const existing = aggregated.get(key)!
        for (let i = 0; i < row.metricValues.length; i++) {
            const current = parseFloat(existing.metricValues[i].value || '0')
            const newValue = parseFloat(row.metricValues[i].value || '0')
            existing.metricValues[i].value = String(current + newValue)
        }
    }

    return Array.from(aggregated.values())
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { productId, month, accessToken: providedAccessToken } = body

        if (!productId || !month) {
            return NextResponse.json(
                { error: 'productIdとmonth（YYYY-MM形式）は必須です' },
                { status: 400 }
            )
        }

        if (!/^\d{4}-\d{2}$/.test(month)) {
            return NextResponse.json(
                { error: '月はYYYY-MM形式で指定してください' },
                { status: 400 }
            )
        }

        const [year, monthNum] = month.split('-').map(Number)
        const weeklyRanges = getWeeklyRangesForMonth(year, monthNum)

        const trendReports = await prisma.report.findMany({
            where: {
                productId: parseInt(productId, 10),
                executionMode: 'trend',
                isActive: true,
            },
        })

        if (trendReports.length === 0) {
            return NextResponse.json(
                { error: 'トレンド対象のレポートが見つかりませんでした。Analyticsページでレポートの「実行モード」を「トレンド対象」に設定してください。' },
                { status: 400 }
            )
        }

        const accessToken = await getGA4AccessToken(providedAccessToken)
        const trendData: any[] = []

        // 各レポートについて週次データを取得
        for (const report of trendReports) {
            const config = report.config as any
            if (!config.propertyId || !config.cvrA) {
                continue
            }

            const weeklyResults: any[] = []

            for (const week of weeklyRanges) {
                try {
                    const ga4Request: any = {
                        propertyId: config.propertyId,
                        dateRanges: [{ startDate: week.start, endDate: week.end }],
                        dimensions: config.dimensions || [],
                        metrics: config.metrics || [],
                        limit: config.limit || 10000,
                    }

                    if (config.filter?.dimension && config.filter?.operator && config.filter?.expression) {
                        const expressions = config.filter.expression
                            .split(',')
                            .map((s: string) => s.trim())
                            .filter(Boolean)

                        if (expressions.length > 0) {
                            if (expressions.length > 1) {
                                ga4Request.dimensionFilter = {
                                    orGroup: {
                                        expressions: expressions.map((exp: string) => ({
                                            filter: {
                                                fieldName: config.filter.dimension,
                                                stringFilter: {
                                                    matchType: config.filter.operator.toUpperCase(),
                                                    value: exp,
                                                },
                                            },
                                        })),
                                    },
                                }
                            } else {
                                ga4Request.dimensionFilter = {
                                    filter: {
                                        fieldName: config.filter.dimension,
                                        stringFilter: {
                                            matchType: config.filter.operator.toUpperCase(),
                                            value: expressions[0],
                                        },
                                    },
                                }
                            }
                        }
                    }

                    const reportData = await fetchGA4Data(ga4Request, accessToken)
                    const aggregatedReport = {
                        ...reportData,
                        rows: aggregateReportRows(reportData.rows || []),
                    }

                    const dimensionHeaders = reportData.dimensionHeaders || []
                    const metricHeaders = reportData.metricHeaders || []
                    const dataA = calculateCVR(
                        aggregatedReport,
                        config.cvrA,
                        dimensionHeaders,
                        metricHeaders
                    )

                    weeklyResults.push({
                        period: `${week.start}〜${week.end}`,
                        startDate: week.start,
                        endDate: week.end,
                        dataA,
                    })
                } catch (error) {
                    console.error(`Error fetching data for week ${week.start}-${week.end}:`, error)
                    weeklyResults.push({
                        period: `${week.start}〜${week.end}`,
                        startDate: week.start,
                        endDate: week.end,
                        dataA: { pv: 0, cv: 0, cvr: 0 },
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                }
            }

            trendData.push({
                reportId: report.id,
                reportName: report.name,
                cvrConfig: config.cvrA,
                weeklyResults,
            })
        }

        const trendDataWithTotals = trendData.map((data) => {
            const totalPV = data.weeklyResults.reduce((sum: number, item: any) => sum + item.dataA.pv, 0)
            const totalCV = data.weeklyResults.reduce((sum: number, item: any) => sum + item.dataA.cv, 0)
            const totalCVR = totalPV > 0 ? totalCV / totalPV : 0

            return {
                ...data,
                monthlyTotal: {
                    pv: totalPV,
                    cv: totalCV,
                    cvr: totalCVR,
                },
            }
        })

        return NextResponse.json({
            success: true,
            month,
            trendData: trendDataWithTotals,
        })
    } catch (error) {
        console.error('Monthly Trend Report API Error:', error)
        const errorMessage = error instanceof Error ? error.message : '月次トレンドレポートの生成に失敗しました'
        return NextResponse.json(
            createErrorResponse(error, errorMessage),
            { status: 500 }
        )
    }
}
