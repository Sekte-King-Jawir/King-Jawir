"use client"
import styles from './ProductCard.module.css'

export default function ProductCard({product, title, price, img}:{product?:any,title?:string,price?:any,img?:string}){
  const p = product ?? { image: img, name: title, price }

  const image = p?.image
  const name = p?.name ?? ""
  const amount = p?.price

  return (
    <article className={styles.card}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.thumb} src={image} alt={name} />
      ) : (
        <div className={styles.thumb} />
      )}
      <div className={styles.title}>{name}</div>
      <div className={styles.price}>Rp {amount?.toLocaleString?.() ?? amount}</div>
    </article>
  )
}
