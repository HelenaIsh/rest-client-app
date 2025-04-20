'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Variable {
  name: string;
  value: string;
}

interface VariablesContextType {
  variables: Variable[];
  addVariable: (variable: Variable) => void;
  removeVariable: (name: string) => void;
  getVariableValue: (name: string) => string | undefined;
  substituteVariables: (text: string) => {
    result: string;
    missingVariables: string[];
  };
}

const VariablesContext = createContext<VariablesContextType | undefined>(
  undefined
);

export function VariablesProvider({ children }: { children: React.ReactNode }) {
  const [variables, setVariables] = useState<Variable[]>([]);

  useEffect(() => {
    const storedVariables = localStorage.getItem('rest-client-variables');
    if (storedVariables) {
      setVariables(JSON.parse(storedVariables));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rest-client-variables', JSON.stringify(variables));
  }, [variables]);

  const addVariable = (variable: Variable) => {
    setVariables((prev) => {
      const exists = prev.some((v) => v.name === variable.name);
      if (exists) {
        return prev.map((v) =>
          v.name === variable.name ? { ...v, value: variable.value } : v
        );
      }
      return [...prev, variable];
    });
  };

  const removeVariable = (name: string) => {
    setVariables((prev) => prev.filter((v) => v.name !== name));
  };

  const getVariableValue = (name: string) => {
    const variable = variables.find((v) => v.name === name);
    return variable?.value;
  };

  const substituteVariables = (
    text: string
  ): { result: string; missingVariables: string[] } => {
    const missingVariables: string[] = [];
    const result = text.replace(/{{([^}]+)}}/g, (match, variableName) => {
      const value = getVariableValue(variableName);
      if (value === undefined) {
        missingVariables.push(variableName);
        return match;
      }
      return value;
    });
    return { result, missingVariables };
  };

  return (
    <VariablesContext.Provider
      value={{
        variables,
        addVariable,
        removeVariable,
        getVariableValue,
        substituteVariables,
      }}
    >
      {children}
    </VariablesContext.Provider>
  );
}

export function useVariables() {
  const context = useContext(VariablesContext);
  if (context === undefined) {
    throw new Error('useVariables must be used within a VariablesProvider');
  }
  return context;
}
