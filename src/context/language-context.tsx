import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "../types";
import { ApiService } from "../services/api-service";

interface LanguageContextType {
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  fetchLanguages: () => Promise<void>;
  getLanguageByCode: (code: string) => Language | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLanguages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getLanguages();
      setLanguages(data);
    } catch (err) {
      setError("Failed to fetch languages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLanguageByCode = (code: string) => {
    return languages.find(l => l.code === code);
  };
  
  // Load languages on initial mount
  useEffect(() => {
    fetchLanguages();
  }, []);
  
  return (
    <LanguageContext.Provider
      value={{
        languages,
        isLoading,
        error,
        fetchLanguages,
        getLanguageByCode
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguages = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguages must be used within a LanguageProvider");
  }
  return context;
};