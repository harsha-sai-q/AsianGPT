import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="glass w-full rounded-2xl p-8">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign in page scaffold with Supabase-ready flow.</p>
        <Button className="mt-6 w-full">Continue</Button>
        <p className="mt-4 text-sm text-zinc-400">No account? <Link href="/auth/sign-up" className="text-cyan-300">Sign up</Link></p>
      </div>
    </main>
  );
}
