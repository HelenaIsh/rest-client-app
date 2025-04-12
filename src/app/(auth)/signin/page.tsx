'use client';
import { useState } from 'react';
import { signIn, signInWithGoogle } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



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
    } catch (err: unknown) { // Zmieniamy typ na unknown
      console.error('Login error:', err);
      // Tłumaczenie komunikatów błędów na język polski
      if (typeof err === 'object' && err !== null && 'code' in err) {
        if (err.code === 'auth/invalid-credential') {
          setError('Invalid credentials. Please check your email and password or sign up if you do not have an account yet.');
        } else if (err.code === 'auth/user-not-found') {
          setError('User with this email does not exist. Sign up to create an account.');
        } else if (err.code === 'auth/wrong-password') {
          setError('Incorrect password. Please try again.');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too many unsuccessful login attempts. Please try again later.');
        } else {
  if (err instanceof Error) {
    setError(err.message || 'Failed to sign in. Please try again later.');
  } else {
    setError('An unknown error occurred.');
  }
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-center text-2xl font-bold mb-6">Sign In</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"             
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>          

          <div className="signin-buttons">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>          <Link href="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Sign Up
            </Link>   
          </div>
        </form>

        <div className="mt-4 border-t pt-4">
        {/* <button
          type="button"
          onClick={async () => {}}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
            Sign in with Google
        </button> */}

<div className="mt-4 border-t pt-4">
         <div className="mt-4 border-t pt-4">
            <span className="signin-divider-text">Or continue with</span>
          </div>
        </div>

        </div>

        <button
          type="button"
          onClick={async () => {
            setError('');
            setLoading(true);
            try {
              const userCredential = await signInWithGoogle();
              // Set auth token in cookie for middleware to use
              const token = await userCredential.user.getIdToken();
              document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
                router.push('/client');
            }
catch (err: unknown) {
  console.error('Google login error:', err);
  if (err instanceof Error) {
    setError(err.message || 'Failed to sign in with Google...');
  } else {
    setError('An unknown error occurred.');
  }
}
               finally {
              setLoading(false);
            }
          }}
          
          disabled={loading}
          className=""
        >
          <svg className="signin-google-icon" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />

          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );}
