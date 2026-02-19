'use client'

import Sidebar from './Sidebar'
import styles from './AppShell.module.css'

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.wrapper}>
            <Sidebar />
            <main className={styles.main}>{children}</main>
        </div>
    )
}
