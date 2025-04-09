'use client';

import { useState } from 'react';
import { useVariables } from '@/app/context/VariablesContext';

export default function Variables() {
  const { variables, addVariable, removeVariable } = useVariables();
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVariable.name && newVariable.value) {
      addVariable(newVariable);
      setNewVariable({ name: '', value: '' });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Variables</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Variable name"
            value={newVariable.name}
            onChange={(e) =>
              setNewVariable((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Variable value"
            value={newVariable.value}
            onChange={(e) =>
              setNewVariable((prev) => ({ ...prev, value: e.target.value }))
            }
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Variable
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {variables.map((variable) => (
          <div
            key={variable.name}
            className="flex items-center gap-4 p-4 border rounded"
          >
            <div className="flex-1">
              <div className="font-mono p-2 rounded mb-2">
                {`{{${variable.name}}}`}
              </div>
              <div className="text-gray-600">{variable.value}</div>
            </div>
            <button
              onClick={() => removeVariable(variable.name)}
              className="px-3 py-1 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
