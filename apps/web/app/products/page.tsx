import { Suspense } from 'react'
import { ProductsContent } from './ProductsContent'
import styles from './page.module.css'

function ProductsLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>Loading products...</div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  )
}
