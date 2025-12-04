'use client'

import Navbar from './components/Navbar'
import {
  HeroSection,
  CategorySection,
  FeaturedProducts,
  PromoBanner,
  NewArrivals,
  PopularProducts,
  Newsletter,
  Footer,
  FlashSaleSection,
  BrandsSection,
  CollectionShowcase,
  TestimonialsSection,
} from './components/home'

// Data imports - separated from UI
import { categories, products } from '@/data/home'

// ============================================================================
// MAIN PAGE - Clean, dengan UI dan data terpisah
// ============================================================================

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <BrandsSection />
        <CategorySection categories={categories} />
        <FlashSaleSection />
        <FeaturedProducts products={products} />
        <PromoBanner />
        <PopularProducts products={products} />
        <CollectionShowcase />
        <NewArrivals products={products} />
        <TestimonialsSection />
        <Newsletter />
        <Footer />
      </main>
    </>
  )
}
