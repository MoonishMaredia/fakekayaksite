import React, { createContext, useState, useContext } from 'react';

const ResultsContext = createContext();

export function useResults() {
  return useContext(ResultsContext);
}

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState({});

  return (
    <ResultsContext.Provider value={{ results , setResults }}>
      {children}
    </ResultsContext.Provider>
  );
};