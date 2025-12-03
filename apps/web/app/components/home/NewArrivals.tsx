interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  store: {
    id: string
    name: string
  } | null
}

interface NewArrivalsProps {
  products: Product[]
}

export default function NewArrivals({ products: _products }: NewArrivalsProps): React.JSX.Element {
  return <div className="hidden" />
}
