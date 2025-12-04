'use client'

import { testimonials } from '@/data/home'
import type { Testimonial } from '@/types'

// ============================================================================
// STAR RATING - Pure UI Component
// ============================================================================

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps): React.JSX.Element {
  return (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ============================================================================
// TESTIMONIAL CARD - Pure UI Component
// ============================================================================

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Content */}
      <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">{testimonial.avatar}</span>
        </div>
        <div>
          <p className="font-bold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN TESTIMONIALS SECTION
// ============================================================================

export default function TestimonialsSection(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full mb-3">
            TESTIMONI
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Apa Kata Mereka? 💬
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ribuan pelanggan puas dengan layanan kami. Ini beberapa testimoni dari mereka.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
