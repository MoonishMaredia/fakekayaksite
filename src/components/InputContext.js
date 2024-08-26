import React, { createContext, useState, useContext } from 'react';

const InputContext = createContext();

export function useInput() {
  return useContext(InputContext);
}

export const InputProvider = ({ children }) => {
  // const [searchInputs, setSearchInputs] = useState({
  //   "trip_type": "Round-trip",
  //   "flying_from": "MIA",
  //   "flying_to": "JFK",
  //   "start_date": '2024-09-15',
  //   "return_date": '2024-09-30',
  //   "num_passengers": 1,
  //   "seat_type": "Economy",
  //   "num_carryOn": 1,
  //   "num_checked": 0
  // });

  const [searchInputs, setSearchInputs] = useState({
    "trip_type":"",
    "flying_from":"",
    "flying_to":"",
    "start_date":null,
    "return_date":null,
    "num_passengers":1,
    "seat_type":"Economy",
    "num_carryOn": 1,
    "num_checked":0
  });

  return (
    <InputContext.Provider value={{ searchInputs, setSearchInputs }}>
      {children}
    </InputContext.Provider>
  );
};