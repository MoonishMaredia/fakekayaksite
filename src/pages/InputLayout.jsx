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
  const [adults, setAdults] = useState(null);
  const [children, setChildren] = useState(null);
  const [carryOnBags, setCarryOnBags] = useState(null);
  const [checkedBags, setCheckedBags] = useState(null);

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
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
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
      adults={adults}
      setAdults={setAdults}
      children={children}
      setChildren={setChildren}
      carryOnBags={carryOnBags}
      setCarryOnBags={setCarryOnBags}
      checkedBags={checkedBags}
      setCheckedBags={setCheckedBags}/>
    </Box>
  );
};

export default InputLayout;
