import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import GenerateCode, { GenerateCodeProps } from '../GenerateCode';
import { VariablesProvider } from '@/app/context/VariablesContext';

const mockSetGeneratedCode = vi.fn();

const renderWithContext = (props: GenerateCodeProps) => {
  return render(
    <VariablesProvider>
      <GenerateCode {...props} />
    </VariablesProvider>
  );
};

describe('GenerateCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates curl code for GET request', () => {
    renderWithContext({
      language: 'curl',
      method: 'GET',
      url: 'https://api.example.com',
      body: '',
      setGeneratedCode: mockSetGeneratedCode,
    });

    expect(mockSetGeneratedCode).toHaveBeenCalledWith(
      'curl -X GET https://api.example.com'
    );
  });

  it('generates JavaScript Fetch code for POST request', () => {
    renderWithContext({
      language: 'jsFetch',
      method: 'POST',
      url: 'https://api.example.com',
      body: '{"key":"value"}',
      setGeneratedCode: mockSetGeneratedCode,
    });

    expect(mockSetGeneratedCode).toHaveBeenCalledWith(
      `fetch('https://api.example.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{"key":"value"}',
}).then(response => response.json());`
    );
  });

  it('generates Python code for GET request', () => {
    renderWithContext({
      language: 'python',
      method: 'GET',
      url: 'https://api.example.com',
      body: '',
      setGeneratedCode: mockSetGeneratedCode,
    });

    expect(mockSetGeneratedCode).toHaveBeenCalledWith(
      `import requests
response = requests.get('https://api.example.com')
print(response.status_code)`
    );
  });

  it('generates Python code for POST request with body', () => {
    renderWithContext({
      language: 'python',
      method: 'POST',
      url: 'https://api.example.com',
      body: '{"key":"value"}',
      setGeneratedCode: mockSetGeneratedCode,
    });

    expect(mockSetGeneratedCode).toHaveBeenCalledWith(
      `import requests
response = requests.post('https://api.example.com', json={"key":"value"})
print(response.json())`
    );
  });
});
