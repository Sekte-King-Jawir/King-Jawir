'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import styles from './product.module.css'

export default function ProductsPage(): React.ReactElement {
  const [products, setProducts] = useState<any[] | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('no api')
        const data = await res.json()
        if (mounted) setProducts(data)
      } catch (_) {
        // fallback sample
        if (mounted)
          setProducts([
            { id: 1, name: 'Contoh Produk A', price: 120000, image: '/placeholder.png' },
            { id: 2, name: 'Contoh Produk B', price: 85000, image: '/placeholder.png' },
          ])
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main>
      <Navbar />
      <section className={styles.container}>
        <h2>Produk</h2>
        <div className={styles.grid}>
          {products === null ? (
            <div>Memuat...</div>
          ) : products.length === 0 ? (
            <div>Tidak ada produk</div>
          ) : (
            products.map(p => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>
    </main>
  )
}
