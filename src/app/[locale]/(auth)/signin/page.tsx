'use client';

import { useState } from 'react';
import { signIn, signInWithGoogle } from '../../../../firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import GoogleIcon from '../../../../components/GoogleIcon';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      const token = await userCredential.user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      router.push(`/${locale}/client`);
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as { code: string; message: string };
        if (
          firebaseError.code === 'auth/invalid-credential' ||
          firebaseError.code === 'auth/user-not-found' ||
          firebaseError.code === 'auth/wrong-password'
        ) {
          setError('Invalid email or password.');
        } else if (firebaseError.code === 'auth/too-many-requests') {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(
            firebaseError.message
              ? `Sign in failed: ${firebaseError.message}`
              : 'An unknown error occurred during sign in.'
          );
        }
      } else if (err instanceof Error) {
        setError(
          err.message
            ? `Sign in failed: ${err.message}`
            : 'An unknown error occurred during sign in.'
        );
      } else {
        setError('An unknown error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-2">
          Sign In
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to access your account
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={async () => {
                setError('');
                setLoading(true);
                try {
                  const userCredential = await signInWithGoogle();
                  const token = await userCredential.user.getIdToken();
                  document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
                  router.push(`/${locale}/client`);
                } catch (err: unknown) {
                  console.error('Google login error:', err);
                  if (err instanceof Error) {
                    setError(
                      err.message
                        ? `Google Sign-in failed: ${err.message}`
                        : 'An unknown error occurred during Google Sign-in.'
                    );
                  } else {
                    setError(
                      'An unknown error occurred during Google Sign-in.'
                    );
                  }
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <GoogleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          {/* Zmieniono Don't na Don&apos;t */}
          Don&apos;t have an account?{' '}
          <Link
            href={`/${locale}/signup`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
