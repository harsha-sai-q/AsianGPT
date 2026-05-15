import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-4 p-4">
        <Sidebar />
        <main className="glass min-h-[calc(100vh-6rem)] flex-1 rounded-2xl p-6">{children}</main>
      </div>
    </div>
  );
}
