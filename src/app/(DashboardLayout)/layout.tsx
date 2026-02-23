export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar section */}
      <aside className="w-64 border-r p-4 hidden md:block">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}