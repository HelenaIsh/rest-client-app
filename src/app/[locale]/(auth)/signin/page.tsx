'use client';

import { useTranslations } from 'next-intl';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';

const SignInPage: React.FC = () => {
  const t = useTranslations('SignInPage');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [signInWithEmailAndPassword, , , error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
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
        case 'auth/invalid-email':
          errorMessage = t('errors.invalidEmail');
          break;
        case 'auth/user-disabled':
          errorMessage = t('errors.userDisabled');
          break;
        case 'auth/user-not-found':
          errorMessage = t('errors.userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('errors.wrongPassword');
          break;
        case 'auth/invalid-credential':
          errorMessage = t('errors.invalidCredential');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('errors.tooManyRequests');
          break;
      }
      setToastMessage({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [error, t]);

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        setEmail('');
        setPassword('');
        setErrors({ email: '', password: '' });
        router.push('/');
      }
    } catch {}
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[\p{L}]/u.test(password) &&
      /[0-9]/.test(password) &&
      /[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: validateEmail(email) ? '' : t('errors.invalidEmail'),
      password: validatePassword(password)
        ? ''
        : t('errors.passwordRequirements'),
    };
    setErrors(newErrors);
    if (!newErrors.email && !newErrors.password) {
      await handleSignIn();
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
            placeholder={t('form.emailPlaceholder')}
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
            placeholder={t('form.passwordPlaceholder')}
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

export default SignInPage;
