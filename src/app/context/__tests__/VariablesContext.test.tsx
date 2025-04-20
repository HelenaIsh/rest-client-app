import { act, renderHook } from '@testing-library/react';
import { VariablesProvider, useVariables } from '../VariablesContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('VariablesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VariablesProvider>{children}</VariablesProvider>
  );

  it('should initialize with empty variables', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });
    expect(result.current.variables).toEqual([]);
  });

  it('should load variables from localStorage on mount', () => {
    const storedVariables = [{ name: 'testVar', value: 'testValue' }];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedVariables));

    const { result } = renderHook(() => useVariables(), { wrapper });
    expect(result.current.variables).toEqual(storedVariables);
  });

  it('should add a new variable', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'newVar', value: 'newValue' });
    });

    expect(result.current.variables).toEqual([
      { name: 'newVar', value: 'newValue' },
    ]);
  });

  it('should update existing variable', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'testVar', value: 'value1' });
      result.current.addVariable({ name: 'testVar', value: 'value2' });
    });

    expect(result.current.variables).toEqual([
      { name: 'testVar', value: 'value2' },
    ]);
  });

  it('should remove a variable', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'testVar', value: 'testValue' });
      result.current.removeVariable('testVar');
    });

    expect(result.current.variables).toEqual([]);
  });

  it('should get variable value', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'testVar', value: 'testValue' });
    });

    expect(result.current.getVariableValue('testVar')).toBe('testValue');
    expect(result.current.getVariableValue('nonexistent')).toBeUndefined();
  });

  it('should substitute variables in text', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'name', value: 'John' });
      result.current.addVariable({ name: 'age', value: '30' });
    });

    const { result: substituted, missingVariables } =
      result.current.substituteVariables(
        'Hello {{name}}, you are {{age}} years old'
      );

    expect(substituted).toBe('Hello John, you are 30 years old');
    expect(missingVariables).toEqual([]);
  });

  it('should handle missing variables in substitution', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    const { result: substituted, missingVariables } =
      result.current.substituteVariables(
        'Hello {{name}}, you are {{age}} years old'
      );

    expect(substituted).toBe('Hello {{name}}, you are {{age}} years old');
    expect(missingVariables).toEqual(['name', 'age']);
  });

  it('should persist variables to localStorage', () => {
    const { result } = renderHook(() => useVariables(), { wrapper });

    act(() => {
      result.current.addVariable({ name: 'testVar', value: 'testValue' });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'rest-client-variables',
      JSON.stringify([{ name: 'testVar', value: 'testValue' }])
    );
  });
});
