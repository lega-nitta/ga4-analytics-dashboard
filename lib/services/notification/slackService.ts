/**
 * Slack通知サービス
 * 元のGASコードのsendSlackNotification関数を参考に実装
 */

/** Slack Block Kit（divider は type のみ、header/section は text または fields を持つ） */
export interface SlackBlock {
    type: string
    text?: { type: string; text: string }
    fields?: Array<{ type: string; text: string }>
    elements?: Array<{ type: string; text: string }>
}

/**
 * Slack通知を送信
 * 複数のWebhook URLに対してSlack通知を送信する
 * @param webhookUrls - Slack Webhook URLの配列
 * @param blocks - Slack Block Kit形式のメッセージブロック
 * @returns Promise<void>
 */
export async function sendSlackNotification(
    webhookUrls: string[],
    blocks: SlackBlock[]
): Promise<void> {
    if (!webhookUrls || webhookUrls.length === 0 || webhookUrls[0] === '') {
        return
    }

    const payload = { blocks }

    for (const url of webhookUrls) {
        if (!url) continue
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                console.error(`Slack通知の送信に失敗しました (URL: ${url}): ${response.statusText}`)
            }
        } catch (error) {
            console.error(`Slack通知の送信に失敗しました (URL: ${url}):`, error)
        }
    }
}
