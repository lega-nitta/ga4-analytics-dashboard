'use client'

import { isValidElement } from 'react'
import type { SelectWrapperProps } from './types'
import styles from './SelectWrapper.module.css'

/**
 * ネイティブ select をラップし、フォーカス時に矢印が回転するアニメーションを付与する。
 * 子は単一の <select> 要素であること。
 */
export default function SelectWrapper({ children, className = '' }: SelectWrapperProps) {
    const child = isValidElement(children) ? children : null
    if (!child || (child.type !== 'select' && typeof (child.type as any) !== 'string')) {
        return <>{children}</>
    }
    return (
        <div className={`${styles.wrapper} ${className}`.trim()}>
            {child}
            <span className={styles.arrow} aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                    <path fill="currentColor" d="M6 8L1 3h10z" />
                </svg>
            </span>
        </div>
    )
}
