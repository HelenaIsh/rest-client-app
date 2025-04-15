'use client';

import { useTranslations } from 'next-intl';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';

const SignUpPage: React.FC = () => {
  const t = useTranslations('SignUpPage');
  const [createUserWithEmailAndPassword, , , error] =
    useCreateUserWithEmailAndPassword(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (error) {
      let errorMessage = t('errors.unknown');
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = t('errors.emailInUse');
          break;
        case 'auth/invalid-email':
          errorMessage = t('errors.invalidEmail');
          break;
        case 'auth/operation-not-allowed':
          errorMessage = t('errors.operationNotAllowed');
          break;
        case 'auth/weak-password':
          errorMessage = t('errors.weakPassword');
          break;
      }
      setToastMessage({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [error, t]);

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res) {
        setEmail('');
        setPassword('');
        setErrors({ email: '', password: '' });
        router.push('/');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[\p{L}]/u.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: validateEmail(email) ? '' : 'Invalid email address',
      password: validatePassword(password)
        ? ''
        : 'Password must be at least 8 characters and include a letter, a number, and a special character.',
    };
    setErrors(newErrors);
    if (!newErrors.email && !newErrors.password) {
      await handleSignUp();
    }
  };

  if (loading) {
    return <Loading className="h-full" />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col relative">
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold text-center">{t('mode')}</h2>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        >
          {t('mode')}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
