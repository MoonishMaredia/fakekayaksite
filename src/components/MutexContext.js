import React, { createContext, useContext, useRef } from 'react';

const MutexContext = createContext();

export function useMutex() {
  return useContext(MutexContext);
}

export const MutexProvider = ({ children }) => {
  const mutexRef = useRef(Promise.resolve(() => {}));

  const acquire = async () => {
    const unlock = await mutexRef.current;

    let release;
    const newLock = new Promise(resolve => {
      release = () => resolve(() => {});
    });

    mutexRef.current = newLock;
    unlock();

    return release;
  };

  return (
    <MutexContext.Provider value={acquire}>
      {children}
    </MutexContext.Provider>
  );
};