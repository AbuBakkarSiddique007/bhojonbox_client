export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar section */}
            <nav className="border-b px-6 py-4">
                <h1 className="text-xl font-bold">BhojonBox</h1>
            </nav>

            <main className="flex-1">{children}</main>

            {/* Footer section */}
            <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} BhojonBox. All rights reserved.
            </footer>
        </div>
    );
}