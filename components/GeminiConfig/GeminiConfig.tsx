'use client'

import NeonCheckbox from '@/components/NeonCheckbox'
import type { GeminiConfigProps } from './types'
import styles from './GeminiConfig.module.css'

export default function GeminiConfig({
    enabled,
    apiKey,
    onEnabledChange,
    onApiKeyChange,
}: GeminiConfigProps) {
    return (
        <div className={styles.container}>
            <div className={styles.checkboxContainer}>
                <NeonCheckbox
                    id="gemini-enabled"
                    checked={enabled}
                    onChange={onEnabledChange}
                />
                <div className={styles.checkboxContent}>
                    <label htmlFor="gemini-enabled" className={styles.checkboxLabel}>
                        Gemini評価を有効化（AI使用制限に注意）
                    </label>
                    <p className={styles.checkboxHelp}>
                        ⚠️ AI APIの使用制限があるため、必要な場合のみ有効化してください
                    </p>
                </div>
            </div>
            {enabled && (
                <div className={styles.apiKeySection}>
                    <label className={styles.apiKeyLabel}>
                        Gemini API Key（オプション）
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        placeholder="未入力の場合は環境変数 GEMINI_API_KEY を使用"
                        className={styles.apiKeyInput}
                    />
                    <p className={styles.apiKeyHelp}>
                        フォームに入力しない場合、環境変数 GEMINI_API_KEY が使用されます
                    </p>
                </div>
            )}
        </div>
    )
}
