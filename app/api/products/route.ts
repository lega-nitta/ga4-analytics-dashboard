/**
 * プロダクト管理API
 */

import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/client'
import { getErrorMessage, getErrorStack, createErrorResponse } from '@/lib/utils/error'

function isDbConnectionError(error: unknown): boolean {
    if (error instanceof Prisma.PrismaClientInitializationError) return true
    const msg = getErrorMessage(error).toLowerCase()
    return msg.includes("can't reach database") || msg.includes('connection refused') || msg.includes('econnrefused')
}

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json({
            success: true,
            products,
        })
    } catch (error) {
        console.error('Products API Error:', error)
        const isConnectionError = isDbConnectionError(error)
        const defaultMessage = isConnectionError
            ? 'Database is not reachable. Start PostgreSQL (e.g. docker-compose -f docker-compose.local.yml up -d).'
            : 'Failed to fetch products'
        return NextResponse.json(
            createErrorResponse(error, defaultMessage),
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description, domain, ga4PropertyId } = body

        if (!name) {
            return NextResponse.json(
                { error: 'Product name is required' },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                domain,
                ga4PropertyId,
            },
        })

        return NextResponse.json({
            success: true,
            product,
        })
    } catch (error) {
        console.error('Create Product API Error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'Failed to create product'),
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, name, description, domain, ga4PropertyId, isActive } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                domain,
                ga4PropertyId,
                isActive,
            },
        })

        return NextResponse.json({
            success: true,
            product,
        })
    } catch (error) {
        console.error('Update Product API Error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'Failed to update product'),
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        await prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: { isActive: false },
        })

        return NextResponse.json({
            success: true,
        })
    } catch (error) {
        console.error('Delete Product API Error:', error)
        return NextResponse.json(
            createErrorResponse(error, 'Failed to delete product'),
            { status: 500 }
        )
    }
}
