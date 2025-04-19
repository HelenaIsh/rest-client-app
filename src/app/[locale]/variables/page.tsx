'use client';

import dynamic from 'next/dynamic';
import { VariablesComponent } from './VariablesComponent';

const Variables = dynamic(() => Promise.resolve(VariablesComponent), {
  ssr: false,
});

export default Variables;
