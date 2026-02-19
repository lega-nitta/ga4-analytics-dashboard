import type { ReactNode } from 'react'

export interface NeonCheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    id?: string
    children?: ReactNode
    className?: string
}
