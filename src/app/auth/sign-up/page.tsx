import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="glass w-full rounded-2xl p-8">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign up page scaffold with typed validation hooks.</p>
        <Button className="mt-6 w-full">Create account</Button>
        <p className="mt-4 text-sm text-zinc-400">Have an account? <Link href="/auth/sign-in" className="text-cyan-300">Sign in</Link></p>
      </div>
    </main>
  );
}
