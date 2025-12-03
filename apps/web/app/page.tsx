// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default async function Home() {
  // Fetch categories and products from local API
  const API_BASE = process.env.API_URL || 'http://localhost:4101'

  const [catRes, prodRes] = await Promise.all([
    fetch(`${API_BASE}/categories`),
    fetch(`${API_BASE}/products?limit=8`),
  ])

  const catJson = await catRes.json().catch(() => null)
  const prodJson = await prodRes.json().catch(() => null)

  const categories = catJson && catJson.success && catJson.data ? catJson.data.categories : []
  const products = prodJson && prodJson.success && prodJson.data ? prodJson.data.products : []

  return (
    <main className="w-full bg-gray-50 text-slate-900">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium tracking-wide uppercase">
              Pro. Beyond
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              iPhone 14 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pro</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Created to change everything for the better. For everyone.
            </p>
            <div className="flex gap-4 pt-2">
              <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                Shop Now
              </button>
              <button className="px-8 py-3 border border-white/50 rounded-full hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/img/hero_iphone.png"
              width={500}
              height={500}
              alt="iPhone 14 Pro"
              className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative overflow-hidden">
              <Image src="/img/f1.png" width={600} height={300} alt="PS5" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl">Playstation 5</h3>
              <p className="text-gray-500 mt-2">Play Has No Limits.</p>
              <button className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-2 group/btn">
                Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative overflow-hidden">
              <Image src="/img/f2.png" width={600} height={300} alt="AirPods Max" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl">AirPods Max</h3>
              <p className="text-gray-500 mt-2">A perfect balance of high-fidelity audio.</p>
              <button className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-2 group/btn">
                Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative overflow-hidden">
              <Image src="/img/f3.png" width={600} height={300} alt="Vision Pro" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl">Vision Pro</h3>
              <p className="text-gray-500 mt-2">Welcome to Spatial Computing.</p>
              <button className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-2 group/btn">
                Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Browse by Category</h2>
          <Link href="/categories" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c: any, i: number) => (
            <div 
              key={c.id || i} 
              className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={(c && c.image) || `/img/c_${(c && c.slug) || 'phone'}.png`}
                  width={40}
                  height={40}
                  alt={c.name}
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-center">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 text-white text-center md:text-left md:max-w-lg">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              🔥 Limited Time Offer
            </span>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Up to 50% Off on Selected Items
            </h3>
            <p className="text-white/80 mb-6">
              Don&apos;t miss out on our biggest sale of the year. Shop now and save big!
            </p>
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              Shop the Sale
            </button>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
          <Link href="/products" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any, i: number) => (
            <div 
              key={p.id || i} 
              className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                <Image
                  src={p.image || `/img/p${(i % 8) + 1}.png`}
                  fill
                  alt={p.name}
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                  ❤️
                </button>
              </div>
              <h4 className="font-semibold text-sm md:text-base line-clamp-2">{p.name}</h4>
              <p className="text-lg font-bold text-purple-600 mt-2">
                {p.price ? `$${p.price}` : 'Contact Us'}
              </p>
              <button className="w-full mt-4 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Get the latest updates on new products and upcoming sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-4">cyber</h3>
            <p className="text-gray-500 text-sm">
              We are an electronics store providing the best devices with top-notch quality and service.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                📸
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Bonus program</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Gift cards</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Credit & Payment</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Service contracts</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Assistance</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Find a store</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Delivery</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Return policy</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Contact us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Terms of delivery</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Return policy</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">Order tracking</li>
              <li className="hover:text-purple-600 cursor-pointer transition-colors">FAQs</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2025 Cyber. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
