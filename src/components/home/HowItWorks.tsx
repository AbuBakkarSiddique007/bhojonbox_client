export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-r from-white to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-amber-600">How FoodHub Works</h2>
          <p className="mt-2 text-amber-500">Order from nearby restaurants and get delicious meals delivered fast.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">🛒</div>
            <h3 className="mt-4 font-semibold text-slate-800">Browse & Order</h3>
            <p className="mt-2 text-sm text-slate-600">Explore menus, pick your favorites, and place an order in seconds.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">👩‍🍳</div>
            <h3 className="mt-4 font-semibold text-slate-800">Freshly Prepared</h3>
            <p className="mt-2 text-sm text-slate-600">Restaurants prepare your meal with care using quality ingredients.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm text-center">
            <div className="text-4xl">🚚</div>
            <h3 className="mt-4 font-semibold text-slate-800">Quick Delivery</h3>
            <p className="mt-2 text-sm text-slate-600">Track your order and enjoy timely delivery at your door.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
