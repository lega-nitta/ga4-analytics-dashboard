import type { ReactNode } from 'react'

export interface BackLinkProps {
    href: string
    children: ReactNode
    className?: string
    direction?: 'back' | 'forward'
}
