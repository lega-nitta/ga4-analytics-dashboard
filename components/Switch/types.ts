export interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    id?: string
    className?: string
    'aria-label'?: string
}
