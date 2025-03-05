// mark as client component
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// mark as client component

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
