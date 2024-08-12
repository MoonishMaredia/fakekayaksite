import React, { createContext, useState, useContext } from 'react';
import {flightDataObj} from '../utils/testResultsFinal.js'

const ResultsContext = createContext();

export function useResults() {
  return useContext(ResultsContext);
}

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState(flightDataObj);
  // const [results, setResults] = useState();

  return (
    <ResultsContext.Provider value={{ results , setResults }}>
      {children}
    </ResultsContext.Provider>
  );
};