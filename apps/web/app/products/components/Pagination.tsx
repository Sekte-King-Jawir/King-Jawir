'use client'

import Link from 'next/link'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  baseUrl?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsis = totalPages > 7
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page)
    }
  }

  const renderPageButton = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
          ...
        </span>
      )
    }

    const pageNum = page as number
    const isActive = pageNum === currentPage

    if (baseUrl) {
      return (
        <Link
          key={pageNum}
          href={`${baseUrl}?page=${pageNum}`}
          className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
        >
          {pageNum}
        </Link>
      )
    }

    return (
      <button
        key={pageNum}
        className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
        onClick={() => handlePageClick(pageNum)}
        disabled={isActive}
      >
        {pageNum}
      </button>
    )
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.navButton}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>
      
      <div className={styles.pages}>
        {getPageNumbers().map((page, index) => renderPageButton(page, index))}
      </div>
      
      <button
        className={styles.navButton}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  )
}
