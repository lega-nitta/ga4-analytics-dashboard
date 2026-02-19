/**
 * GA4ディメンションの定数
 * 選択可能なディメンションのリスト
 */

export const GA4_CVR_DIMENSIONS = [
    { value: 'customEvent:data_view_label', label: 'data_view_label' },
    { value: 'customEvent:data_click_label', label: 'data_click_label' },
]

export const GA4_FILTER_DIMENSIONS = [
    { value: 'date', label: 'date' },
    { value: 'dateHour', label: 'dateHour' },
    { value: 'dateHourMinute', label: 'dateHourMinute' },
    { value: 'day', label: 'day' },
    { value: 'dayOfWeek', label: 'dayOfWeek' },
    { value: 'dayOfWeekName', label: 'dayOfWeekName' },
    { value: 'hour', label: 'hour' },
    { value: 'minute', label: 'minute' },
    { value: 'month', label: 'month' },
    { value: 'week', label: 'week' },
    { value: 'year', label: 'year' },
    { value: 'yearMonth', label: 'yearMonth' },
    { value: 'yearWeek', label: 'yearWeek' },
    { value: 'isoWeek', label: 'isoWeek' },
    { value: 'isoYear', label: 'isoYear' },
    { value: 'isoYearIsoWeek', label: 'isoYearIsoWeek' },
    
    // イベント関連
    { value: 'eventName', label: 'eventName' },
    { value: 'isKeyEvent', label: 'isKeyEvent' },
    
    // 地理関連
    { value: 'country', label: 'country' },
    { value: 'countryId', label: 'countryId' },
    { value: 'city', label: 'city' },
    { value: 'cityId', label: 'cityId' },
    { value: 'region', label: 'region' },
    { value: 'continent', label: 'continent' },
    { value: 'continentId', label: 'continentId' },
    
    // デバイス関連
    { value: 'deviceCategory', label: 'deviceCategory' },
    { value: 'deviceModel', label: 'deviceModel' },
    { value: 'mobileDeviceBranding', label: 'mobileDeviceBranding' },
    { value: 'mobileDeviceMarketingName', label: 'mobileDeviceMarketingName' },
    { value: 'mobileDeviceModel', label: 'mobileDeviceModel' },
    { value: 'operatingSystem', label: 'operatingSystem' },
    { value: 'operatingSystemVersion', label: 'operatingSystemVersion' },
    { value: 'operatingSystemWithVersion', label: 'operatingSystemWithVersion' },
    { value: 'browser', label: 'browser' },
    { value: 'screenResolution', label: 'screenResolution' },
    { value: 'platform', label: 'platform' },
    { value: 'platformDeviceCategory', label: 'platformDeviceCategory' },
    
    // ページ関連
    { value: 'pagePath', label: 'pagePath' },
    { value: 'pagePathPlusQueryString', label: 'pagePathPlusQueryString' },
    { value: 'pageTitle', label: 'pageTitle' },
    { value: 'pageLocation', label: 'pageLocation' },
    { value: 'pageReferrer', label: 'pageReferrer' },
    { value: 'landingPage', label: 'landingPage' },
    { value: 'landingPagePlusQueryString', label: 'landingPagePlusQueryString' },
    { value: 'fullPageUrl', label: 'fullPageUrl' },
    { value: 'hostName', label: 'hostName' },
    { value: 'unifiedPagePathScreen', label: 'unifiedPagePathScreen' },
    { value: 'unifiedPageScreen', label: 'unifiedPageScreen' },
    
    // トラフィックソース関連
    { value: 'source', label: 'source' },
    { value: 'medium', label: 'medium' },
    { value: 'sourceMedium', label: 'sourceMedium' },
    { value: 'sourcePlatform', label: 'sourcePlatform' },
    { value: 'campaign', label: 'campaign' },
    { value: 'campaignId', label: 'campaignId' },
    { value: 'campaignName', label: 'campaignName' },
    { value: 'sessionSource', label: 'sessionSource' },
    { value: 'sessionMedium', label: 'sessionMedium' },
    { value: 'sessionSourceMedium', label: 'sessionSourceMedium' },
    { value: 'sessionSourcePlatform', label: 'sessionSourcePlatform' },
    { value: 'sessionCampaign', label: 'sessionCampaign' },
    { value: 'sessionCampaignId', label: 'sessionCampaignId' },
    { value: 'sessionCampaignName', label: 'sessionCampaignName' },
    { value: 'sessionDefaultChannelGroup', label: 'sessionDefaultChannelGroup' },
    { value: 'sessionPrimaryChannelGroup', label: 'sessionPrimaryChannelGroup' },
    { value: 'defaultChannelGroup', label: 'defaultChannelGroup' },
    { value: 'primaryChannelGroup', label: 'primaryChannelGroup' },
    
    // ユーザー関連
    { value: 'userAgeBracket', label: 'userAgeBracket' },
    { value: 'userGender', label: 'userGender' },
    { value: 'newVsReturning', label: 'newVsReturning' },
    { value: 'firstSessionDate', label: 'firstSessionDate' },
    { value: 'signedInWithUserId', label: 'signedInWithUserId' },
    
    // 言語関連
    { value: 'language', label: 'language' },
    { value: 'languageCode', label: 'languageCode' },
    
    // その他
    { value: 'streamId', label: 'streamId' },
    { value: 'streamName', label: 'streamName' },
    { value: 'contentGroup', label: 'contentGroup' },
    { value: 'contentId', label: 'contentId' },
    { value: 'contentType', label: 'contentType' },
]

// 全ディメンション（後方互換性のため）
export const GA4_DIMENSIONS = [
    ...GA4_CVR_DIMENSIONS,
    ...GA4_FILTER_DIMENSIONS,
]

export const GA4_METRICS = [
    { value: 'eventCount', label: 'eventCount' },
    { value: 'totalUsers', label: 'totalUsers' },
    { value: 'activeUsers', label: 'activeUsers' },
    { value: 'sessions', label: 'sessions' },
    { value: 'screenPageViews', label: 'screenPageViews' },
    { value: 'conversions', label: 'conversions' },
    { value: 'totalRevenue', label: 'totalRevenue' },
    { value: 'purchaseRevenue', label: 'purchaseRevenue' },
    { value: 'averageSessionDuration', label: 'averageSessionDuration' },
    { value: 'bounceRate', label: 'bounceRate' },
    { value: 'engagementRate', label: 'engagementRate' },
]

export const GA4_FILTER_OPERATORS = [
    { value: 'EXACT', label: '完全に一致' },
    { value: 'BEGINS_WITH', label: '前方一致' },
    { value: 'ENDS_WITH', label: '後方一致' },
    { value: 'CONTAINS', label: '部分一致（正規表現は使用不可）' },
    { value: 'FULL_REGEXP', label: '完全一致（正規表現）' },
    { value: 'PARTIAL_REGEXP', label: '部分一致（正規表現）' },
]

/**
 * ディメンション名を表示用に変換
 * customEvent:data_view_label → data_view_label
 */
export function formatDimensionLabel(dimension: string): string {
    if (dimension.startsWith('customEvent:')) {
        return dimension.replace('customEvent:', '')
    }
    return dimension
}

/**
 * 表示用ラベルから実際のディメンション値を取得
 * data_view_label → customEvent:data_view_label
 */
export function getDimensionValue(label: string): string {
    // 既に customEvent: が含まれている場合はそのまま返す
    if (label.startsWith('customEvent:')) {
        return label
    }
    // カスタムイベントの可能性が高い場合は customEvent: を付ける
    if (label.includes('_label') || label.includes('_dimension')) {
        return `customEvent:${label}`
    }
    return label
}
