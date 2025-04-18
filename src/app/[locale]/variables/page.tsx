'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useVariables } from '@/app/context/VariablesContext';
import { useTranslations } from 'next-intl';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '@/components/Loading';

const VariablesComponent = () => {
  const { variables, addVariable, removeVariable } = useVariables();
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });
  const t = useTranslations('Variables');
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading className="h-full" />;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVariable.name && newVariable.value) {
      addVariable(newVariable);
      setNewVariable({ name: '', value: '' });
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-4">{t('description')}</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder={t('variableNamePlaceholder')}
            className="flex-1 border rounded px-3 py-2"
            value={newVariable.name}
            onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
          />
          <input
            type="text"
            placeholder={t('variableValuePlaceholder')}
            className="flex-1 border rounded px-3 py-2"
            value={newVariable.value}
            onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            {t('addVariableButton')}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {variables.map((variable) => (
          <div key={variable.name} className="flex items-center gap-4">
            <span className="font-mono">{variable.name}</span>
            <span className="font-mono">{variable.value}</span>
            <button
              onClick={() => removeVariable(variable.name)}
              className="text-red-500 hover:text-red-700"
            >
              {t('deleteButton')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Variables = dynamic(() => Promise.resolve(VariablesComponent), {
  ssr: false,
});

export default Variables;
