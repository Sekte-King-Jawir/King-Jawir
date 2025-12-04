import { Suspense } from 'react'
import { ProductsContent } from './ProductsContent'

function ProductsLoading(): React.JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-6 min-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 text-base">
        Loading products...
      </div>
    </div>
  )
}

export default function ProductsPage(): React.JSX.Element {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  )
}
