"use client"
import React, {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import styles from './category.module.css'
import Link from 'next/link'

export default function CategoryPage(): React.ReactElement{
  const [categories,setCategories] = useState<any[]|null>(null)
  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const res = await fetch('/api/categories')
        if(!res.ok) throw new Error('no api')
        const data = await res.json()
        if(mounted) setCategories(data)
      }catch(_){
        if(mounted) setCategories([
          {id:1,name:'Elektronik'},{id:2,name:'Pakaian'},{id:3,name:'Rumah Tangga'}
        ])
      }
    }
    load()
    return ()=>{mounted=false}
  },[])

  return (
    <main>
      <Navbar />
      <section className={styles.wrap}>
        <h2>Kategori</h2>
        <div className={styles.list}>
          {categories === null ? 'Memuat...' : categories.map(c=> (
            <Link key={c.id} href={`/category/${c.id}`} className={styles.item}>{c.name}</Link>
          ))}
        </div>
      </section>
    </main>
  )
}
