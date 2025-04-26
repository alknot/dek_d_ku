'use client';

import React from 'react';

interface TermCount {
  schName: string;
  count: number;
}
export default function ChartDisplay({ data }: { data: TermCount[] }) {
  const payload = encodeURIComponent(JSON.stringify(data));
  return (
    <img
      src={`/_next/image?url=/api/chart?payload=${payload}&w=700&q=75`}
      alt="Applicant Counts Chart"
      className="mx-auto"
    />
  );
}
