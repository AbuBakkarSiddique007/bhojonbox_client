import Link from 'next/link';

export default function WhyBhojonbox() {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-amber-600">Why Bhojonbox?</h2>
          <p className="mt-2 text-amber-500">We connect you with local restaurants for fresh, fast, and reliable meals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">🌿</div>
            <h3 className="mt-4 font-semibold text-slate-800">Locally Sourced</h3>
            <p className="mt-2 text-sm text-slate-600">We prioritize local providers who use fresh ingredients.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">🏅</div>
            <h3 className="mt-4 font-semibold text-slate-800">Vetted Chefs</h3>
            <p className="mt-2 text-sm text-slate-600">Restaurants are reviewed and rated to ensure high quality.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 font-semibold text-slate-800">Fast Delivery</h3>
            <p className="mt-2 text-sm text-slate-600">Optimized routing gets meals to you quickly and hot.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
