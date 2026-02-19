'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { AbTest, AbTestCalendarProps } from './types'
import styles from './AbTestCalendar.module.css'

export default function AbTestCalendar({ abTests, onDateClick }: AbTestCalendarProps) {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [hoveredTest, setHoveredTest] = useState<AbTest | null>(null)
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

    const changeMonth = (delta: number) => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + delta)
            return newDate
        })
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const getTestsForDate = (date: Date): AbTest[] => {
        const dateStr = date.toISOString().split('T')[0]
        const filteredTests = abTests.filter((test) => {
            const startDate = new Date(test.startDate).toISOString().split('T')[0]
            const endDate = test.endDate
                ? new Date(test.endDate).toISOString().split('T')[0]
                : null
            
            if (dateStr < startDate) return false
            
            if (endDate && dateStr > endDate) return false
            
            return test.status === 'running' || test.status === 'completed'
        })
        
        return filteredTests.sort((a, b) => {
            const dateA = new Date(a.startDate).getTime()
            const dateB = new Date(b.startDate).getTime()
            return dateA - dateB
        })
    }

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        
        const firstDay = new Date(year, month, 1)
        const firstDayOfWeek = firstDay.getDay()
        
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        
        const prevMonthLastDay = new Date(year, month, 0).getDate()
        const prevMonthDays: (Date | null)[] = []
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            prevMonthDays.push(new Date(year, month - 1, prevMonthLastDay - i))
        }
        
        const currentMonthDays: Date[] = []
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push(new Date(year, month, i))
        }
        
        const totalDays = prevMonthDays.length + currentMonthDays.length
        const nextMonthDays: (Date | null)[] = []
        const remainingDays = 42 - totalDays // 6週間 × 7日 = 42日
        for (let i = 1; i <= remainingDays; i++) {
            nextMonthDays.push(new Date(year, month + 1, i))
        }
        
        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
    }, [currentDate])

    const isToday = (date: Date | null): boolean => {
        if (!date) return false
        const today = new Date()
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        )
    }

    const isCurrentMonth = (date: Date | null): boolean => {
        if (!date) return false
        return (
            date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth()
        )
    }

    const getTestColor = (testId: number): string => {
        const colorClasses = [
            styles.testItemBlue,
            styles.testItemGreen,
            styles.testItemPurple,
            styles.testItemOrange,
            styles.testItemPink,
            styles.testItemIndigo,
            styles.testItemTeal,
            styles.testItemRed,
        ]
        return colorClasses[testId % colorClasses.length]
    }

    const weekDays = ['日', '月', '火', '水', '木', '金', '土']
    const monthNames = [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
    ]

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button
                        onClick={() => changeMonth(-1)}
                        className={styles.monthButton}
                    >
                        ←
                    </button>
                    <h2 className={styles.monthTitle}>
                        {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
                    </h2>
                    <button
                        onClick={() => changeMonth(1)}
                        className={styles.monthButton}
                    >
                        →
                    </button>
                </div>
                <button
                    onClick={goToToday}
                    className={styles.todayButton}
                >
                    今日
                </button>
            </div>

            <div className={styles.calendarGrid}>
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className={styles.weekDay}
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map((date, index) => {
                    if (!date) return <div key={index} className={styles.emptyCell} />
                    
                    const tests = getTestsForDate(date)
                    const isCurrentMonthDay = isCurrentMonth(date)
                    const isTodayDate = isToday(date)

                    return (
                        <div
                            key={index}
                            onClick={() => onDateClick && onDateClick(date, tests)}
                            className={`${styles.dayCell} ${
                                !isCurrentMonthDay ? styles.dayCellOtherMonth : ''
                            } ${isTodayDate ? styles.dayCellToday : ''} ${
                                onDateClick ? styles.dayCellClickable : ''
                            }`}
                        >
                            <div
                                className={`${styles.dayNumber} ${
                                    !isCurrentMonthDay ? styles.dayNumberOtherMonth : ''
                                } ${isTodayDate ? styles.dayNumberToday : ''}`}
                            >
                                {date.getDate()}
                            </div>
                            <div className={styles.testList}>
                                {tests.slice(0, 3).map((test) => (
                                    <div
                                        key={test.id}
                                        className={`${styles.testItem} ${getTestColor(test.id)} ${
                                            test.status === 'completed' ? styles.testItemCompleted : ''
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`/ab-test/${test.id}`)
                                        }}
                                        onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect()
                                            const scrollX = window.scrollX || window.pageXOffset
                                            const scrollY = window.scrollY || window.pageYOffset
                                            setHoveredTest(test)
                                            setHoverPosition({
                                                x: rect.left + scrollX + rect.width / 2,
                                                y: rect.top + scrollY - 10,
                                            })
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredTest(null)
                                            setHoverPosition(null)
                                        }}
                                    >
                                        {test.name}
                                    </div>
                                ))}
                                {tests.length > 3 && (
                                    <div className={styles.testMore}>
                                        +{tests.length - 3}件
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className={styles.legend}>
                <h3 className={styles.legendTitle}>凡例</h3>
                <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendColorBlue}`}></div>
                        <span>実行中のテスト</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendColorBlueCompleted}`}></div>
                        <span>完了したテスト</span>
                    </div>
                </div>
                <p className={styles.legendHint}>
                    💡 テスト名にカーソルを合わせると詳細が表示されます。クリックで詳細ページに移動します。
                </p>
            </div>

            {hoveredTest && hoverPosition && (
                <div
                    className={styles.tooltip}
                    style={{
                        left: `${hoverPosition.x}px`,
                        top: `${hoverPosition.y}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <h4 className={styles.tooltipTitle}>{hoveredTest.name}</h4>
                    <p className={styles.tooltipText}>
                        プロダクト: {hoveredTest.product.name}
                    </p>
                    {hoveredTest.description && (
                        <p className={`${styles.tooltipText} ${styles.tooltipTextClamped}`}>
                            {hoveredTest.description}
                        </p>
                    )}
                    <p className={styles.tooltipText}>
                        期間: {new Date(hoveredTest.startDate).toLocaleDateString('ja-JP')}
                        {hoveredTest.endDate && ` - ${new Date(hoveredTest.endDate).toLocaleDateString('ja-JP')}`}
                    </p>
                    <p className={styles.tooltipText}>
                        バリアント: {(() => {
                            const variants = ['A', 'B']
                            if (hoveredTest.ga4Config?.cvrC?.denominatorDimension) variants.push('C')
                            if (hoveredTest.ga4Config?.cvrD?.denominatorDimension) variants.push('D')
                            return variants.join(' / ')
                        })()}
                    </p>
                    <p className={styles.tooltipLink}>
                        → クリックで詳細を見る
                    </p>
                </div>
            )}
        </div>
    )
}
