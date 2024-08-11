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
  const {setResults} = useResults({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);
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
      "trip_type": searchInputs.trip_type,
      "flying_from": searchInputs.flying_from !=="" ? searchInputs.flying_from : fieldErrors.flying_from,
      "flying_to": searchInputs.flying_to !=="" ? searchInputs.flying_to : fieldErrors.flying_to,
      "start_date": searchInputs.start_date !==null  ? searchInputs.start_date : fieldErrors.start_date,
      "return_date": searchInputs.return_date !==null ? searchInputs.return_date : fieldErrors.return_date,
      "num_passengers": searchInputs.num_passengers !==null ? searchInputs.num_passengers : fieldErrors.num_passengers,
      "seat_type": searchInputs.seat_type !==null ? searchInputs.seat_type : fieldErrors.seatType,
      "num_carryOn": searchInputs.num_carryOn !==null ? searchInputs.num_carryOn : fieldErrors.num_carryOn,
      "num_checked": searchInputs.num_checked !==null ? searchInputs.num_checked : fieldErrors.num_checked
    };

    return objStr
  }

  async function handleSubmit() {
    handleChatClose()
    setSearchInputs(getCompletedObject())
    setLoading(true)
    const resultsData = await getFlightResults(searchInputs.flying_from, searchInputs.flying_to, searchInputs.trip_type)
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
            handleSubmit={handleSubmit}/>
          </Container>
        </Box>
      </Box>
      <ChatModal 
      open={isChatOpen} 
      onClose={handleChatClose} 
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
