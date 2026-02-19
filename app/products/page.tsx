'use client'

import { useEffect, useState } from 'react'
import BackLink from '@/components/BackLink'
import Loader from '@/components/Loader'
import { useProduct } from '@/lib/contexts/ProductContext'
import type { Product } from './types'
import styles from './ProductsPage.module.css'

export default function ProductsPage() {
    const { products, setProducts } = useProduct()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        domain: '',
        ga4PropertyId: '',
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            if (data.error) {
                throw new Error(data.message || data.error)
            }
            setProducts(data.products || [])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
            console.error('Products fetch error:', err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (editingProduct) {
                const response = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingProduct.id,
                        ...formData,
                    }),
                })
                const data = await response.json()
                if (data.error) {
                    throw new Error(data.message || data.error)
                }
            } else {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
                const data = await response.json()
                if (data.error) {
                    throw new Error(data.message || data.error)
                }
            }
            setEditingProduct(null)
            setFormData({ name: '', description: '', domain: '', ga4PropertyId: '' })
            fetchProducts()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
            setError(errorMessage)
        }
    }

    function handleEdit(product: Product) {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description || '',
            domain: product.domain || '',
            ga4PropertyId: product.ga4PropertyId || '',
        })
    }

    function handleCancel() {
        setEditingProduct(null)
        setFormData({ name: '', description: '', domain: '', ga4PropertyId: '' })
    }

    async function handleDelete(id: number) {
        if (!confirm('このプロダクトを削除しますか？')) return
        try {
            const response = await fetch(`/api/products?id=${id}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            if (data.error) {
                throw new Error(data.message || data.error)
            }
            fetchProducts()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
            setError(errorMessage)
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>プロダクト管理</h1>
                    <BackLink href="/">ダッシュボードに戻る</BackLink>
                </div>
                <div className={styles.loaderContainer}>
                    <Loader />
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>プロダクト管理</h1>
                <BackLink href="/">ダッシュボードに戻る</BackLink>
            </div>

            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorTitle}>エラー</p>
                    <p>{error}</p>
                </div>
            )}

            <div className={styles.formSection}>
                <h2 className={styles.formTitle}>
                    {editingProduct ? 'プロダクトを編集' : '新しいプロダクトを追加'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>プロダクト名 *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={styles.formInput}
                                required
                            />
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>ドメイン</label>
                            <input
                                type="text"
                                value={formData.domain}
                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                placeholder="example.com"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>GA4プロパティID</label>
                            <input
                                type="text"
                                value={formData.ga4PropertyId}
                                onChange={(e) => setFormData({ ...formData, ga4PropertyId: e.target.value })}
                                placeholder="492794577"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>説明</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={styles.formInput}
                            />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className="executionButton"
                        >
                            <span>{editingProduct ? '更新' : '追加'}</span>
                        </button>
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={`${styles.button} ${styles.buttonSecondary}`}
                            >
                                キャンセル
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.tableHeaderCell}>プロダクト名</th>
                            <th className={styles.tableHeaderCell}>ドメイン</th>
                            <th className={styles.tableHeaderCell}>GA4プロパティID</th>
                            <th className={styles.tableHeaderCell}>操作</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={`${styles.tableCell} ${styles.tableCellCenter}`}>
                                    プロダクトがありません
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className={styles.tableRow}>
                                    <td className={styles.tableCell}>
                                        {product.name}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {product.domain || '-'}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {product.ga4PropertyId || '-'}
                                    </td>
                                    <td className={styles.actionCell}>
                                        <div className={styles.actionContainer}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className={styles.actionButton}
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className={`${styles.actionButton} ${styles.actionButtonDelete}`}
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
