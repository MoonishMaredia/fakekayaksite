import React, { createContext, useContext, useState } from 'react';

const MutexContext = createContext();

export function useMutex() {
    return useContext(MutexContext);
  }

export const MutexProvider = ({ children }) => {
  const [locked, setLocked] = useState(false);

  const acquire = async () => {
    while (locked) {
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait a bit
    }
    setLocked(true);
  };

  const release = () => {
    setLocked(false);
  };

  return (
    <MutexContext.Provider value={{ acquire, release }}>
      {children}
    </MutexContext.Provider>
  );
};
