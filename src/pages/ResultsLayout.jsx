import React, { useState } from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme, Chip } from '@mui/material';
import TripOptionsBar from '../components/TripOptionsBar';
import FlightSearchBar from '../components/FlightSearchBar';
import FilterComponent from '../components/Filters';

const FlightResultsPage = () => {
  const [tripType, setTripType] = useState('Round-trip');
  const [flyingFrom, setFlyingFrom] = useState('');
  const [flyingTo, setFlyingTo] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [seatType, setSeatType] = useState('Economy');
  const [carryOnBags, setCarryOnBags] = useState(0);
  const [checkedBags, setCheckedBags] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      p: 2, 
      width: isMobile ? '90vw' : '70vw', 
      margin: '20px auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1 
    }}>
      <TripOptionsBar 
        tripType={tripType}
        setTripType={setTripType}
        passengers={passengers}
        setPassengers={setPassengers}
        seatType={seatType}
        setSeatType={setSeatType}
        carryOnBags={carryOnBags}
        setCarryOnBags={setCarryOnBags}
        checkedBags={checkedBags}
        setCheckedBags={setCheckedBags}
      />
      <FlightSearchBar 
        isMobile={isMobile}
        tripType={tripType}
        flyingFrom={flyingFrom}
        setFlyingFrom={setFlyingFrom}
        flyingTo={flyingTo}
        setFlyingTo={setFlyingTo}
        startDate={startDate}
        setStartDate={setStartDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
      />
        <FilterComponent/>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Best departing flights</Typography>
        {[1, 2, 3].map((flight) => (
          <Paper key={flight} sx={{ p: 2 }}>
            <Typography variant="body1">Flight {flight}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default FlightResultsPage;