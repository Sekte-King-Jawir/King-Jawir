'use client'

import { useState, useEffect, useCallback, type JSX } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface ReviewUser {
  id: string
  name: string
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: ReviewUser
}

export interface ReviewStats {
  avgRating: number
  totalReviews: number
  distribution: Record<string, number>
}

export interface ReviewsApiResponse {
  success: boolean
  message: string
  data?: {
    reviews: Review[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    stats: ReviewStats
  }
}

export interface ReviewSectionProps {
  productSlug: string
  productId: string
  /** API base URL */
  apiBaseUrl: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StarIcon({ filled, className }: { filled: boolean; className?: string }): JSX.Element {
  return (
    <span
      className={`${filled ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'} ${className ?? ''}`}
    >
      ★
    </span>
  )
}

function StarRating({ rating, size = 'text-sm' }: { rating: number; size?: string }): JSX.Element {
  return (
    <div className={`flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  )
}

function ReviewsSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="flex gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
        <div>
          <div className="h-12 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="flex-1 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-2 bg-slate-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ReviewSection({
  productSlug,
  productId,
  apiBaseUrl,
}: ReviewSectionProps): JSX.Element {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Review form state
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [canReview, setCanReview] = useState(false)

  const fetchReviews = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${apiBaseUrl}/products/${productSlug}/reviews?page=${page}&limit=5`)
      const data = (await res.json()) as ReviewsApiResponse

      if (data.success && data.data !== undefined) {
        setReviews(data.data.reviews)
        setStats(data.data.stats)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch {
      console.error('Failed to fetch reviews')
    } finally {
      setIsLoading(false)
    }
  }, [apiBaseUrl, productSlug, page])

  // Check if user can review (has purchased)
  useEffect(() => {
    const checkCanReview = async (): Promise<void> => {
      try {
        const res = await fetch(`${apiBaseUrl}/orders`, {
          credentials: 'include',
        })
        const data = (await res.json()) as {
          success: boolean
          data?: {
            orders: {
              status: string
              items: { product: { id: string } }[]
            }[]
          }
        }

        if (data.success && data.data !== undefined) {
          const hasPurchased = data.data.orders.some(
            order =>
              order.status === 'DELIVERED' &&
              order.items.some(item => item.product.id === productId)
          )
          setCanReview(hasPurchased)
        }
      } catch {
        setCanReview(false)
      }
    }

    void checkCanReview()
  }, [apiBaseUrl, productId])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  const handleSubmitReview = async (): Promise<void> => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const res = await fetch(`${apiBaseUrl}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() !== '' ? comment.trim() : undefined,
        }),
      })

      const data = (await res.json()) as { success: boolean; message: string }

      if (data.success) {
        setSubmitMessage('Review berhasil ditambahkan!')
        setComment('')
        setRating(5)
        setShowForm(false)
        setPage(1)
        void fetchReviews()
      } else {
        setSubmitMessage(data.message ?? 'Gagal menambahkan review')
      }
    } catch {
      setSubmitMessage('Gagal menambahkan review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ulasan Produk</h2>
      </div>

      <div className="p-6">
        {isLoading ? (
          <ReviewsSkeleton />
        ) : (
          <>
            {/* Stats */}
            {stats !== null && stats.totalReviews > 0 ? (
              <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                    {stats.avgRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                    <StarRating rating={Math.round(stats.avgRating)} size="text-xl" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {stats.totalReviews} ulasan
                  </p>
                </div>

                {/* Distribution */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.distribution[String(star)] ?? 0
                    const percentage =
                      stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-8 text-sm text-slate-600 dark:text-slate-400">
                          {star} ★
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-slate-500 dark:text-slate-400 text-right">
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Add Review Button */}
            {canReview === true && showForm === false ? (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                ✍️ Tulis Ulasan
              </button>
            ) : null}

            {/* Review Form */}
            {showForm === true ? (
              <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Tulis Ulasan Anda
                </h3>

                {/* Rating Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-colors ${
                          star <= rating
                            ? 'text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Komentar (opsional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Bagikan pengalaman Anda dengan produk ini..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">{comment.length}/1000</p>
                </div>

                {/* Submit Message */}
                {submitMessage !== '' ? (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      submitMessage.includes('berhasil')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {submitMessage}
                  </div>
                ) : null}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => void handleSubmitReview()}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setSubmitMessage('')
                    }}
                    className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : null}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Belum Ada Ulasan
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Jadilah yang pertama memberikan ulasan untuk produk ini
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div
                    key={review.id}
                    className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold shrink-0">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {review.user.name}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        {/* Rating */}
                        <StarRating rating={review.rating} />

                        {/* Comment */}
                        {review.comment !== null && review.comment !== '' ? (
                          <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {review.comment}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                >
                  Selanjutnya
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
