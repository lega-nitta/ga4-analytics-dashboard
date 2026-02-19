export interface CustomSelectOption {
    value: string
    label: string
}

export interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: CustomSelectOption[]
    className?: string
    triggerClassName?: string
    disabled?: boolean
    placeholder?: string
    'aria-label'?: string
}
