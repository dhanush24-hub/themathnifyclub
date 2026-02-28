import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect('/admin-login');

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <AdminNav />
      <div className="pt-16">{children}</div>
    </div>
  );
}
