'use client'

import Link from 'next/link'

export default function HeroSection(): React.JSX.Element {
  return (
    <section className="bg-black text-white">
      {/* Main Hero - iPhone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 py-16 lg:py-20 items-center">
          {/* Left Content */}
          <div className="space-y-5">
            <p className="text-gray-500 text-xs tracking-widest uppercase">Pro.Beyond.</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight">
              IPhone 14 <span className="font-semibold">Pro</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Created to change everything for the better. For everyone.
            </p>
            <Link
              href="/product"
              className="inline-block px-8 py-3 border border-white/70 rounded text-sm font-medium hover:bg-white hover:text-black transition-all"
            >
              Shop Now
            </Link>
          </div>

          {/* Right - Phone Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="text-9xl">📱</div>
          </div>
        </div>
      </div>

      {/* Secondary Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - PlayStation */}
          <div className="bg-gray-500 rounded-lg p-8 flex min-h-[280px]">
            <div className="flex-1">
              <h3 className="text-white text-3xl font-medium mb-3">Playstation 5</h3>
              <p className="text-white/70 text-sm max-w-[240px] leading-relaxed">
                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.
              </p>
            </div>
            <div className="flex items-end">
              <span className="text-7xl">🎮</span>
            </div>
          </div>

          {/* Right - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* AirPods Max */}
            <div className="bg-gray-100 rounded-lg p-5 flex flex-col justify-between min-h-[130px]">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Apple</p>
                <h4 className="text-gray-900 font-semibold text-base mt-1">AirPods Max</h4>
                <p className="text-gray-400 text-xs mt-0.5">Computational audio</p>
              </div>
              <div className="flex justify-end">
                <span className="text-4xl">🎧</span>
              </div>
            </div>

            {/* Vision Pro */}
            <div className="bg-gray-800 rounded-lg p-5 flex flex-col justify-between min-h-[130px]">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Apple</p>
                <h4 className="text-white font-semibold text-base mt-1">Vision Pro</h4>
                <p className="text-gray-500 text-xs mt-0.5">An immersive experience</p>
              </div>
              <div className="flex justify-end">
                <span className="text-4xl">🥽</span>
              </div>
            </div>

            {/* MacBook Air - spans 2 cols */}
            <div className="bg-white rounded-lg col-span-2 p-5 flex justify-between items-center min-h-[130px]">
              <div>
                <h4 className="text-gray-900 text-xl font-light leading-none">Macbook</h4>
                <h3 className="text-gray-900 text-2xl font-semibold leading-tight">Air</h3>
                <p className="text-gray-400 text-xs mt-2 max-w-[200px]">
                  The new 15-inch MacBook Air makes room for more of what you love.
                </p>
                <Link
                  href="/product"
                  className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
              <span className="text-5xl">💻</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
