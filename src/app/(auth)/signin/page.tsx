'use client';

import { useState } from 'react';
import { signIn } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      // Set auth token in cookie for middleware to use
      const token = await userCredential.user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      router.push('/client');
    } catch (err: any) {
      console.error('Login error:', err);
      // Tłumaczenie komunikatów błędów na język polski
      if (err.code === 'auth/invalid-credential') {
        setError('Nieprawidłowe dane logowania. Sprawdź email i hasło lub zarejestruj się, jeśli nie masz jeszcze konta.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Użytkownik o podanym adresie email nie istnieje. Zarejestruj się, aby utworzyć konto.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Nieprawidłowe hasło. Spróbuj ponownie.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.');
      } else {
        setError(err.message || 'Nie udało się zalogować. Spróbuj ponownie później.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold">Sign In</h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
