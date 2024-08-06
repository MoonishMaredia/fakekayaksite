import React, { createContext, useState, useContext } from 'react';
import {flightDataArray} from '../utils/testResultsData.js'

const ResultsContext = createContext();

export function useResults() {
  return useContext(ResultsContext);
}

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState({
    'data': flightDataArray
  });

  return (
    <ResultsContext.Provider value={{ results , setResults }}>
      {children}
    </ResultsContext.Provider>
  );
};