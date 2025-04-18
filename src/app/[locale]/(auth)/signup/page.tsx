'use client';

import { useState } from 'react';
import { signUp } from '@/firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      const token = await userCredential.user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      router.push(`/${locale}/client`);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as { code: string; message: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          setError(
            'This email address is already in use. Please sign in or use a different email address.'
          );
        } else if (firebaseError.code === 'auth/invalid-email') {
          setError(
            'The email address provided is invalid. Please check the email format.'
          );
        } else if (firebaseError.code === 'auth/weak-password') {
          setError(
            'The password is too weak. Please use a stronger password (minimum 6 characters).'
          );
        } else if (firebaseError.code === 'auth/operation-not-allowed') {
          setError('Signing up with email and password is currently disabled.');
        } else {
          setError(
            firebaseError.message ||
              'Failed to sign up. Please try again later.'
          );
        }
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        const errorWithMessage = err as { message: string };
        setError(
          errorWithMessage.message ||
            'Failed to sign up. Please try again later.'
        );
      } else {
        setError('Failed to sign up. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-2">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-6">Create your account</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
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
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href={`/${locale}/signin`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
