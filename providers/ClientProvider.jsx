"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ClientContext = createContext({
  isClient: false,
  isLoading: true
});

export function ClientProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  return (
    <ClientContext.Provider value={{ isClient, isLoading }}>
      {children}
    </ClientContext.Provider>
  );
}

export const useClient = () => useContext(ClientContext); 