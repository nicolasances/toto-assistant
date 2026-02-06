'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderConfig {
  title?: string;
  backButton?: {
    enabled: boolean;
    onClick: () => void;
  };
  rightIcon?: {
    src: string;
    alt: string;
    size?: string;
    color?: string;
  };
  actions?: ReactNode;
  rightButton?: ReactNode;
}

interface HeaderContextType {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HeaderConfig>({
    title: 'Toto Assistant',
  });

  return (
    <HeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
