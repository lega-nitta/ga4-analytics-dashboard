import { NextResponse } from 'next/server'

/**
 * Slack Webhook設定の確認
 */
export async function GET() {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    
    return NextResponse.json({
        configured: !!webhookUrl,
        hasValue: webhookUrl ? webhookUrl.length > 0 : false,
        urlPreview: webhookUrl 
            ? `${webhookUrl.substring(0, 30)}...` 
            : null,
    })
}
