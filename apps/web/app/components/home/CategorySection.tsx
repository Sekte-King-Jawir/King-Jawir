import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface CategorySectionProps {
  categories: Category[]
}

const categoryIcons: Record<string, { icon: string; label: string }> = {
  elektronik: { icon: '📱', label: 'Phones' },
  fashion: { icon: '👔', label: 'Fashion' },
  'makanan-minuman': { icon: '🍔', label: 'Food & Drinks' },
  kesehatan: { icon: '💊', label: 'Health' },
  olahraga: { icon: '⚽', label: 'Sports' },
}

const defaultCategories = [
  { icon: '📱', label: 'Phones', slug: 'phones' },
  { icon: '⌚', label: 'Smart Watches', slug: 'smart-watches' },
  { icon: '📷', label: 'Cameras', slug: 'cameras' },
  { icon: '🎧', label: 'Headphones', slug: 'headphones' },
  { icon: '💻', label: 'Computers', slug: 'computers' },
  { icon: '🎮', label: 'Gaming', slug: 'gaming' },
]

export default function CategorySection({ categories }: CategorySectionProps): React.JSX.Element {
  const displayCategories =
    categories.length > 0
      ? categories.map(cat => ({
          icon: categoryIcons[cat.slug]?.icon ?? '📦',
          label: cat.name,
          slug: cat.slug,
          count: cat.productCount,
        }))
      : defaultCategories

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Browse By Category</h2>
          <div className="flex gap-2">
            <button
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-sm"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-sm"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {displayCategories.slice(0, 5).map((category, index) => (
            <Link
              key={category.slug ?? index}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center justify-center py-6 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 text-3xl group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <p className="text-sm font-medium text-center text-gray-800">{category.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
