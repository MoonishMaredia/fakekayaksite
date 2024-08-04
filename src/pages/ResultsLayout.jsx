import React, { useState } from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme, Chip } from '@mui/material';
import TripOptionsBar from '../components/TripOptionsBar';
import FlightSearchBar from '../components/FlightSearchBar';
import FilterComponent from '../components/Filters';
import FlightCard from '../components/FlightCard';
import HeaderLayout from '../components/HeaderLayout';
import {flightDataArray} from '../utils/testResultsData.js'

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
      <HeaderLayout onChatOpen={handleChatOpen} />
    <Box sx={{ 
      p: 2, 
      width: isMobile ? '90vw' : '100%', 
      maxWidth: '1400px',
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
        isMobile={isMobile}
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
      <Box sx={{ display: 'flex', flexDirection: 'column', 
          maxWidth: isMobile ? '100%' : '82%',
          gap: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Best departing flights</Typography>
        {flightDataArray.map((flight) => (
            <FlightCard
              key={flight}
              isMobile={isMobile}
              flightData={flight}
            />
        ))}
      </Box>
    </Box>
    </Box>
  );
};

export default FlightResultsPage;