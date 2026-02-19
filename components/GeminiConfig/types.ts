export interface GeminiConfigProps {
    enabled: boolean
    apiKey: string
    onEnabledChange: (enabled: boolean) => void
    onApiKeyChange: (apiKey: string) => void
}
