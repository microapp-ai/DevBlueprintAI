// contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>('en');

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Add logic to handle language change, such as updating translations
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
