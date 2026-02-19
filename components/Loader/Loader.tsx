import styles from './Loader.module.css'

export default function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.text}><span>Loading</span></div>
            <div className={styles.line}></div>
        </div>
    )
}
