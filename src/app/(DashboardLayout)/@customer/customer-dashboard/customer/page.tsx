export default function CustomerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold mb-4">Customer Dashboard</h1>

      <p className="text-sm text-muted-foreground mb-6">Welcome to your customer workspace. Use the links below to navigate.</p>

      <div className="flex gap-4">
        <a href="/orders" className="px-4 py-2 rounded bg-primary text-white">My Orders</a>
        <a href="/profile" className="px-4 py-2 rounded border">Profile</a>
      </div>
    </div>
  );
}
