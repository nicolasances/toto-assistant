'use client'

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';

export default function Home() {

  const { setConfig } = useHeader();

  useEffect(() => {
    setConfig({
      title: 'Toto Assistant',
    });
  }, [setConfig]);

  return (
    <div className="app-content">
      <div className="flex flex-col items-center justify-center p-8">
        <h1>Welcome to Toto Assistant</h1>
        <p>Your personal assistant is ready to help!</p>
      </div>
    </div>
  );
}
