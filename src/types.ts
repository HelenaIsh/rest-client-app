export const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export interface Header {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
}
