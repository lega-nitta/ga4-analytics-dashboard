/**
 * Gemini API Keyを取得（フォーム入力 > 環境変数の順でフォールバック）
 */
export function getGeminiApiKey(formApiKey?: string | null): string | null {
    if (formApiKey?.trim()) {
        return formApiKey.trim()
    }
    return process.env.GEMINI_API_KEY || null
}
