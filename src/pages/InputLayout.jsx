import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import HeaderLayout from '../components/HeaderLayout';
import SearchForm from '../components/SearchForm';
import ChatModal from '../components/ChatModal';
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom';
import { getFlightResults } from '../utils/api';
import {useInput} from '../components/InputContext.js'
import {useResults} from '../components/ResultsContext.js'


const InputLayout = () => {

  const navigate = useNavigate();
  const {searchInputs, setSearchInputs} = useInput({});
  const {results, setResults} = useResults({});
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
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    "trip_type":"",
    "flying_from":"",
    "flying_to":"",
    "start_date":"",
    "return_date":"",
    "num_passengers":"",
    "num_carryOn":"",
    "num_checked":""
  })

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function getCompletedObject() {
    const objStr = {
      "trip_type": tripType,
      "flying_from": flyingFrom!=="" ? flyingFrom : fieldErrors.flying_from,
      "flying_to": flyingTo!=="" ? flyingTo : fieldErrors.flying_to,
      "start_date": startDate!==null  ? startDate : fieldErrors.start_date,
      "return_date": returnDate!==null ? returnDate : fieldErrors.return_date,
      "num_passengers": passengers!==null ? passengers : fieldErrors.num_passengers,
      "seat_type": seatType!==null ? seatType : fieldErrors.seatType,
      "num_carryOn": carryOnBags!==null ? carryOnBags : fieldErrors.num_carryOn,
      "num_checked": checkedBags!==null ? checkedBags : fieldErrors.num_checked
    };

    return objStr
  }

  async function handleSubmit() {
    handleChatClose()
    setSearchInputs(getCompletedObject())
    setLoading(true)
    const resultsData = await getFlightResults(flyingFrom, flyingTo, tripType)
    setResults(resultsData)
    await sleep(1000)
    navigate('/results')
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderLayout onChatOpen={handleChatOpen} />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {loading && <LoadingIndicator />}
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
            setCheckedBags={setCheckedBags}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
            getCompletedObject={getCompletedObject}/>
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
      setCheckedBags={setCheckedBags}
      setLoading={setLoading}
      handleSubmit={handleSubmit}
      getCompletedObject={getCompletedObject}
      fieldErrors={fieldErrors}
      setFieldErrors={setFieldErrors}
      />
    </Box>
  );
};

export default InputLayout;
