/**
 * レスポンスを安全にJSONとしてパースする。
 * サーバーがHTML（エラーページ等）を返した場合に分かりやすいエラーを投げる。
 */
export async function parseJsonResponse<T = unknown>(response: Response): Promise<T> {
    const text = await response.text()
    const trimmed = text.trim()
    if (!trimmed || (trimmed.startsWith('<') && trimmed.includes('<!DOCTYPE'))) {
        const url = response.url || '（URL不明）'
        throw new Error(
            `サーバーがJSON以外を返しました（HTTP ${response.status}）。URL: ${url}`
        )
    }
    try {
        return JSON.parse(text) as T
    } catch {
        throw new Error('サーバーのレスポンスの解析に失敗しました。')
    }
}
