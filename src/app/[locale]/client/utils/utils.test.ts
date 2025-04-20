import { describe, it, expect } from 'vitest';
import {
  getFilteredHeaders,
  handleResponse,
  getStatusColor,
  buildRequestUrl,
} from '@/app/[locale]/client/utils/utils';
import { Header } from '@/types';

describe('getFilteredHeaders', () => {
  it('filters out disabled headers', () => {
    const headers: Header[] = [
      { id: 1, key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 2, key: 'Authorization', value: 'Bearer token', enabled: false },
    ];

    const result = getFilteredHeaders(headers);
    expect(result).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('filters out headers with empty keys', () => {
    const headers: Header[] = [
      { id: 1, key: '', value: 'application/json', enabled: true },
      { id: 2, key: 'Authorization', value: 'Bearer token', enabled: true },
    ];

    const result = getFilteredHeaders(headers);
    expect(result).toEqual({
      Authorization: 'Bearer token',
    });
  });

  it('returns empty object for empty headers array', () => {
    const result = getFilteredHeaders([]);
    expect(result).toEqual({});
  });
});

describe('handleResponse', () => {
  it('handles JSON response', async () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
      headers: { 'Content-Type': 'application/json' },
    });

    const { data, detectedLanguage } = await handleResponse(mockResponse);
    expect(data).toBe(JSON.stringify({ data: 'test' }, null, 2));
    expect(detectedLanguage).toBeDefined();
  });

  it('handles text response', async () => {
    const mockResponse = new Response('Hello World', {
      headers: { 'Content-Type': 'text/plain' },
    });

    const { data, detectedLanguage } = await handleResponse(mockResponse);
    expect(data).toBe('Hello World');
    expect(detectedLanguage).toBeDefined();
  });

  it('handles unknown content type', async () => {
    const mockResponse = new Response('Some content', {
      headers: { 'Content-Type': 'unknown/type' },
    });

    const { data, detectedLanguage } = await handleResponse(mockResponse);
    expect(data).toBe('Some content');
    expect(detectedLanguage).toBeDefined();
  });
});

describe('getStatusColor', () => {
  it('returns gray for undefined status', () => {
    expect(getStatusColor(undefined)).toBe('text-gray-500');
  });

  it('returns green for 2xx status', () => {
    expect(getStatusColor(200)).toBe('text-green-600');
    expect(getStatusColor(299)).toBe('text-green-600');
  });

  it('returns blue for 3xx status', () => {
    expect(getStatusColor(300)).toBe('text-blue-600');
    expect(getStatusColor(399)).toBe('text-blue-600');
  });

  it('returns yellow for 4xx status', () => {
    expect(getStatusColor(400)).toBe('text-yellow-600');
    expect(getStatusColor(499)).toBe('text-yellow-600');
  });

  it('returns red for 5xx status', () => {
    expect(getStatusColor(500)).toBe('text-red-600');
    expect(getStatusColor(599)).toBe('text-red-600');
  });
});

describe('buildRequestUrl', () => {
  it('builds URL for GET request', () => {
    const headers: Header[] = [
      { id: 1, key: 'Content-Type', value: 'application/json', enabled: true },
    ];

    const url = buildRequestUrl(
      'https://api.example.com',
      'GET',
      '{}',
      headers
    );

    expect(url).toContain('/client/GET/');
    expect(url).toContain('Content-Type=application%2Fjson');
  });

  it('builds URL for POST request with body', () => {
    const headers: Header[] = [
      { id: 1, key: 'Content-Type', value: 'application/json', enabled: true },
    ];

    const url = buildRequestUrl(
      'https://api.example.com',
      'POST',
      '{"data": "test"}',
      headers
    );

    expect(url).toContain('/client/POST/');
    expect(url).toContain('Content-Type=application%2Fjson');
  });

  it('includes only enabled headers in URL', () => {
    const headers: Header[] = [
      { id: 1, key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 2, key: 'Authorization', value: 'Bearer token', enabled: false },
    ];

    const url = buildRequestUrl(
      'https://api.example.com',
      'GET',
      '{}',
      headers
    );

    expect(url).toContain('Content-Type=application%2Fjson');
    expect(url).not.toContain('Authorization=Bearer%20token');
  });

  it('handles empty headers array', () => {
    const url = buildRequestUrl('https://api.example.com', 'GET', '{}', []);

    expect(url).toContain('/client/GET/');
  });
});
