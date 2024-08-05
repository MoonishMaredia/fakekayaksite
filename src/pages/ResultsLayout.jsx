import React, { useState } from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme, Chip } from '@mui/material';
import TripOptionsBar from '../components/TripOptionsBar';
import FlightSearchBar from '../components/FlightSearchBar';
import FilterComponent from '../components/Filters';
import FlightCard from '../components/FlightCard';
import HeaderLayout from '../components/HeaderLayout';
import {flightDataArray} from '../utils/testResultsData.js'
import {useInput} from '../components/InputContext.js'

const FlightResultsPage = () => {

  const {searchInputs, setSearchInputs} = useInput({})

  const [tripType, setTripType] = useState(searchInputs['trip_type']);
  const [flyingFrom, setFlyingFrom] = useState(searchInputs['flying_from']);
  const [flyingTo, setFlyingTo] = useState(searchInputs['flying_to']);
  const [startDate, setStartDate] = useState(searchInputs['start_date']);
  const [returnDate, setReturnDate] = useState(searchInputs['return_date']);
  const [passengers, setPassengers] = useState(searchInputs['num_passengers']);
  const [seatType, setSeatType] = useState(searchInputs['seat_type']);
  const [carryOnBags, setCarryOnBags] = useState(searchInputs['num_carryOn']);
  const [checkedBags, setCheckedBags] = useState(searchInputs['num_checked']);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  console.log(searchInputs)

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
        <Typography variant="h6" sx={{ mb: 1 }}>Select a Departing Flight</Typography>
        {flightDataArray.map((flight, index) => (
            <FlightCard
              key={index}
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