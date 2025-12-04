import Image from 'next/image'
import Link from 'next/link'
import type { StoreProduct } from '../../types'

interface StoreProductsProps {
  products: StoreProduct[]
  storeName: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function StoreProducts({ products, storeName }: StoreProductsProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
        <span className="text-6xl mb-4 block">📦</span>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Belum Ada Produk
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {storeName} belum menambahkan produk apapun.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Produk dari {storeName}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: StoreProduct
}

function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden hover:shadow-md transition-all"
    >
      {/* Product Image */}
      <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        {product.image !== null && product.image !== '' ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Stock Badge */}
        {product.stock === 0 ? (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            Habis
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
            Sisa {product.stock}
          </div>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold">{formatPrice(product.price)}</p>
        {product.category.name !== '' ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.category.name}</p>
        ) : null}
      </div>
    </Link>
  )
}
