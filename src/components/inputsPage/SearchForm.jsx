import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Popover,
} from '@mui/material';
import AirportAutocomplete from '../shared/AirportAutocomplete.jsx';
import PassengerSelector from '../shared/PassengerSelector.jsx';
import BagSelector from '../shared/BagSelector.jsx';
import EventIcon from '@mui/icons-material/Event';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LuggageIcon from '@mui/icons-material/Luggage';
import { CalendarToday } from '@mui/icons-material';
import {airpotCodes} from '../../airportcodes.js'
import {useInput} from '../InputContext.js'
import moment from 'moment';

const SearchForm = ({
    handleSubmit,
    handleStartDateChange,
    handleReturnDateChange
  }) => {

  const {searchInputs, setSearchInputs} = useInput({})
  const [passengerAnchorEl, setPassengerAnchorEl] = useState(null);
  const [bagAnchorEl, setBagAnchorEl] = useState(null);
  const today = new Date();
  const oneYearFromToday = new Date();
  oneYearFromToday.setFullYear(today.getFullYear() + 1);

  const handlePassengerClick = (event) => {
    setPassengerAnchorEl(event.currentTarget);
  };

  const handlePassengerClose = () => {
    setPassengerAnchorEl(null);
  };

  const handleBagClick = (event) => {
    setBagAnchorEl(event.currentTarget);
  };

  const handleBagClose = () => {
    setBagAnchorEl(null);
  };

  function handleAirportChange(takeOff, newAirport) {
    setSearchInputs(prev => ({...prev, [takeOff ? 'flying_from' : 'flying_to']: newAirport}))
  }


  const isFormValid = () => {
    // Check for empty strings, null or undefined
    if (!searchInputs.trip_type || !searchInputs.flying_from || !searchInputs.flying_to || !searchInputs.start_date || !searchInputs.num_passengers || !searchInputs.seat_type || searchInputs.num_carryOn === null || searchInputs.num_checked === null) {
      return false;
    }
  
    // Check for Round-trip specific condition
    if (searchInputs.trip_type === 'Round-trip' && !searchInputs.return_date) {
      return false;
    }
  
    // Check implicit conditions from the provided functions
    if (!['Round-trip', 'One-way'].includes(searchInputs.trip_type)) return false;
    if (!airpotCodes.hasOwnProperty(searchInputs.flying_from) || !airpotCodes.hasOwnProperty(searchInputs.flying_to)) return false;
    if (searchInputs.flying_from === searchInputs.flying_to) return false;
    if (searchInputs.start_date < new Date()) return false;
    if (searchInputs.trip_type === 'Round-trip' && searchInputs.return_date < searchInputs.start_date) return false;
    if (searchInputs.num_passengers < 1 || searchInputs.num_passengers > 10) return false;
    if (!['Economy', 'Business'].includes(searchInputs.seat_type)) return false;
    if (searchInputs.num_carryOn < 0 || searchInputs.num_carryOn > 1) return false;
    if (searchInputs.num_checked < 0 || searchInputs.num_checked > 5) return false;
  
    return true;
  };

  const passengerOpen = Boolean(passengerAnchorEl);
  const bagOpen = Boolean(bagAnchorEl);
  const totalBags = searchInputs.num_carryOn + searchInputs.num_checked;

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }} gutterBottom>
        Book fake U.S. flights using GPT
      </Typography>
      <Box sx={{ mb: 2, mt: 6, display: 'flex', alignItems: 'center' }}>
      <Select
          value={searchInputs.trip_type}
          onChange={(e) => setSearchInputs(prev=>({...prev, trip_type: e.target.value}))}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) {
              return "Select trip type";
            }
            return selected;
          }}
          variant="outlined"
          sx={{ mr: 1, width: '50%' }}>
          <MenuItem value="" disabled>Select trip type</MenuItem>
          <MenuItem value="Round-trip">Round-trip</MenuItem>
          <MenuItem value="One-way">One-way</MenuItem>
        </Select>
        <TextField
          fullWidth
          variant="outlined"
          value={`${totalBags} bag${totalBags !== 1 ? 's' : ''}`}
          InputProps={{
            readOnly: true,
            startAdornment: <LuggageIcon sx={{ mr: 1 }} />,
          }}
          onClick={handleBagClick}
          sx={{ width: '50%' }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <AirportAutocomplete
          placeholderText={"Flying From..."}
          takeOff={true}
          handleAirportChange={handleAirportChange}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <AirportAutocomplete
          placeholderText={"Flying To..."}
          takeOff={false}
          handleAirportChange={handleAirportChange}
        />
      </Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <DatePicker
          selected={searchInputs.start_date ? moment(searchInputs.start_date).toDate() : null}
          onChange={(date) => handleStartDateChange(date)}
          selectsStart
          startDate={searchInputs.start_date ? moment(searchInputs.start_date).toDate() : null}
          minDate={today} // Disable dates before today
          placeholderText="Start Date"
          customInput={
            <TextField
              fullWidth
              InputProps={{
                startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1 }} />,
                style: { fontSize: '0.9rem' },
              }}
            />
          }
        />
        {searchInputs.trip_type === 'Round-trip' && (
          <DatePicker
          selected={searchInputs.return_date ? moment(searchInputs.return_date).toDate() : null}
          onChange={(date) => handleReturnDateChange(date)}
          selectsEnd
          startDate={searchInputs.start_date ? moment(searchInputs.start_date).toDate() : null}
          endDate={searchInputs.return_date ? moment(searchInputs.return_date).toDate() : null}
          placeholderText="Return Date"
          minDate={searchInputs.start_date ? moment(searchInputs.start_date).toDate() : null}
          maxDate={oneYearFromToday} // Set max date to 1 year from today
          customInput={
            <TextField
              fullWidth
              InputProps={{
                startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1 }} />,
                style: { fontSize: '0.9rem' },
              }}
            />
          }
        />
        )}
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={`${searchInputs.num_passengers ? searchInputs.num_passengers : 0} passenger${searchInputs.num_passengers > 1 ? 's' : ''}, ${searchInputs.seat_type}`}
          InputProps={{
            startAdornment: <PersonOutlineIcon sx={{ mr: 1 }} />,
            readOnly: true,
          }}
          onClick={handlePassengerClick}
        />
        <Popover
          open={passengerOpen}
          anchorEl={passengerAnchorEl}
          onClose={handlePassengerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          <PassengerSelector/>
        </Popover>
      </Box>
      <Popover
        open={bagOpen}
        anchorEl={bagAnchorEl}
        onClose={handleBagClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <BagSelector/>
      </Popover>
      <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          size="large"
          disabled={!isFormValid()}
          sx={{
            backgroundColor: '#FF6B00',
            '&:hover': {
              backgroundColor: '#E66000',
            },
            '&:disabled': {
              backgroundColor: '#FFB27F',
            },
          }}>
          Search
      </Button>
    </>
  );
};

export default SearchForm;