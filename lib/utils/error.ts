/**
 * エラーハンドリングユーティリティ
 */

/**
 * エラーオブジェクトからエラーメッセージを取得
 * @param error - エラーオブジェクト（Error、unknown、その他）
 * @returns エラーメッセージ文字列
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'Unknown error'
}

/**
 * エラーオブジェクトからスタックトレースを取得
 * @param error - エラーオブジェクト
 * @returns スタックトレース文字列、またはundefined
 */
export function getErrorStack(error: unknown): string | undefined {
    if (error instanceof Error) {
        return error.stack
    }
    return undefined
}

/**
 * APIエラーレスポンスを作成
 * @param error - エラーオブジェクト
 * @param defaultMessage - デフォルトエラーメッセージ
 * @param statusCode - HTTPステータスコード（デフォルト: 500）
 * @returns NextResponse用のエラーレスポンスオブジェクト
 */
export function createErrorResponse(
    error: unknown,
    defaultMessage: string,
    statusCode: number = 500
) {
    const message = getErrorMessage(error)
    const stack = process.env.NODE_ENV === 'development' ? getErrorStack(error) : undefined

    return {
        error: defaultMessage,
        message,
        ...(stack && { stack }),
    }
}
