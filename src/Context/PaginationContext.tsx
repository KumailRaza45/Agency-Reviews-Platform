import React, { createContext, useContext, useState, FC, ReactNode } from 'react';

interface PaginationContextType {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemPerPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

interface PaginationProviderProps {
  children: ReactNode;
}

export const PaginationProvider: FC<PaginationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  const value: PaginationContextType = {
    currentPage,
    setCurrentPage,
    setItemPerPage,
    itemsPerPage,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = (): PaginationContextType => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};