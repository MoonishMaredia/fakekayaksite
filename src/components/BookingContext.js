import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export function useBooking() {
  return useContext(BookingContext);
}

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({});

  return (
    <BookingContext.Provider value={{ bookingDetails , setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};