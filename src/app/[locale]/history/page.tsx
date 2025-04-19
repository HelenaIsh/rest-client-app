'use client';

import dynamic from 'next/dynamic';
import { HistoryComponent } from './HistoryComponent';

const History = dynamic(() => Promise.resolve(HistoryComponent), {
  ssr: false,
});

export default History;
