'use client'

import type { ViewModeTabsProps } from '../types'
import styles from './ViewModeTabs.module.css'

export default function ViewModeTabs({ viewMode, onViewModeChange }: ViewModeTabsProps) {
    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <button
                    onClick={() => onViewModeChange('single')}
                    className={`${styles.button} ${
                        viewMode === 'single'
                            ? styles.buttonActive
                            : styles.buttonInactive
                    }`}
                >
                    単一期間分析
                </button>
                <button
                    onClick={() => onViewModeChange('compare')}
                    className={`${styles.button} ${
                        viewMode === 'compare'
                            ? styles.buttonActive
                            : styles.buttonInactive
                    }`}
                >
                    期間比較
                </button>
            </div>
        </div>
    )
}
