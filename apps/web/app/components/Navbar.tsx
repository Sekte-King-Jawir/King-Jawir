"use client"
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar(): React.ReactElement {
  return (
    <header className={styles.root}>
      <div className={styles.brand}><Link href="/">King Jawir</Link></div>
      <div className={styles.search}>
        <input aria-label="search" placeholder="Cari produk, kategori..." />
      </div>
      <nav className={styles.navItems}>
        <Link href="/">Home</Link>
        <Link href="/product">About</Link>
        <Link href="/category">Contact Us</Link>
        <Link href="/contact">Blog</Link>
        <Link href="/favourites">❤️</Link>
        <Link href="/cart">🧺</Link>
        <Link href="/profile">👤</Link>
      </nav>
    </header>
  )
}
