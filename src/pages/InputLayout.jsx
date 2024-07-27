import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import HeaderLayout from '../components/HeaderLayout';
import SearchForm from '../components/SearchForm';
import ChatModal from '../components/ChatModal';

const InputLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  const [tripType, setTripType] = useState("");
  const [flyingFrom, setFlyingFrom] = useState("");
  const [flyingTo, setFlyingTo] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(null)
  const [seatType, setSeatType] = useState("Economy")
  const [carryOnBags, setCarryOnBags] = useState(1);
  const [checkedBags, setCheckedBags] = useState(0);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderLayout onChatOpen={handleChatOpen} />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Container maxWidth="sm" sx={{ mt: 4 }}>
          <SearchForm 
            tripType={tripType}
            setTripType={setTripType}
            flyingFrom={flyingFrom}
            setFlyingFrom={setFlyingFrom}
            flyingTo={flyingTo}
            setFlyingTo={setFlyingTo}
            startDate={startDate}
            setStartDate={setStartDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            passengers={passengers}
            setPassengers={setPassengers}
            seatType={seatType}
            setSeatType={setSeatType}
            carryOnBags={carryOnBags}
            setCarryOnBags={setCarryOnBags}
            checkedBags={checkedBags}
            setCheckedBags={setCheckedBags}/>
          </Container>
        </Box>
      </Box>
      <ChatModal 
      open={isChatOpen} 
      onClose={handleChatClose} 
      tripType={tripType}
      setTripType={setTripType}
      flyingFrom={flyingFrom}
      setFlyingFrom={setFlyingFrom}
      flyingTo={flyingTo}
      setFlyingTo={setFlyingTo}
      startDate={startDate}
      setStartDate={setStartDate}
      returnDate={returnDate}
      setReturnDate={setReturnDate}
      passengers={passengers}
      setPassengers={setPassengers}
      seatType={seatType}
      setSeatType={setSeatType}
      carryOnBags={carryOnBags}
      setCarryOnBags={setCarryOnBags}
      checkedBags={checkedBags}
      setCheckedBags={setCheckedBags}/>
    </Box>
  );
};

export default InputLayout;
