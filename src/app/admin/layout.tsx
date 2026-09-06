import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './_shell';
import { verifySession, SESSION_COOKIE } from '@/lib/adminAuth';

export const metadata: Metadata = {
  title: 'Admin — Akamco',
  robots: 'noindex,nofollow',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h        = headers();
  const pathname = h.get('x-pathname') ?? '';
  const username = h.get('x-username')  ?? 'admin';
  const role     = h.get('x-user-role') ?? 'editor';

  // Login page renders standalone — no sidebar shell, no auth check needed
  if (pathname === '/admin/login') return <>{children}</>;

  // Second-layer auth guard: verify session cookie server-side regardless of middleware
  const sessionToken = cookies().get(SESSION_COOKIE)?.value;
  const session      = sessionToken ? await verifySession(sessionToken) : null;
  if (!session) redirect('/admin/login');

  return (
    <AdminShell username={username} role={role}>
      {children}
    </AdminShell>
  );
}
