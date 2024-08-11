import React, { createContext, useState, useContext } from 'react';

const InputContext = createContext();

export function useInput() {
  return useContext(InputContext);
}

export const InputProvider = ({ children }) => {
  const [searchInputs, setSearchInputs] = useState({
    "trip_type": "",
    "flying_from": "",
    "flying_to": "",
    "start_date": null,
    "return_date": null,
    "num_passengers": 1,
    "seat_type": "Economy",
    "num_carryOn": 1,
    "num_checked": 0
  });

  // const [searchInputs, setSearchInputs] = useState({});

  return (
    <InputContext.Provider value={{ searchInputs, setSearchInputs }}>
      {children}
    </InputContext.Provider>
  );
};