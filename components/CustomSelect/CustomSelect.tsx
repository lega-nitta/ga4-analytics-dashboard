'use client'

import { useEffect, useRef, useState } from 'react'
import type { CustomSelectProps } from './types'
import styles from './CustomSelect.module.css'

export default function CustomSelect(props: CustomSelectProps) {
    const {
        value,
        onChange,
        options,
        className = '',
        triggerClassName = '',
        disabled = false,
        placeholder = '選択してください',
        'aria-label': ariaLabel = '選択',
    } = props
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((o) => o.value === value)
    const displayLabel = selectedOption?.label ?? placeholder

    useEffect(() => {
        if (!open) return
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setOpen(false)
    }

    return (
        <div ref={containerRef} className={`${styles.root} ${className}`.trim()}>
            <button
                type="button"
                className={`${styles.trigger} ${triggerClassName}`.trim()}
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
            >
                <span className={styles.value}>{displayLabel}</span>
                <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`} aria-hidden>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                        <path fill="currentColor" d="M4 2 L8 6 L4 10" />
                    </svg>
                </span>
            </button>
            {open && (
                <div className={styles.optionsList} role="listbox" aria-activedescendant={value ? `option-${value}` : undefined}>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            role="option"
                            id={`option-${opt.value}`}
                            aria-selected={opt.value === value}
                            className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
