import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Popover,
  IconButton,
  FormControl,
  InputLabel
} from '@mui/material';
import AirportAutocomplete from '../shared/AirportAutocomplete.jsx';
import PassengerSelector from '../shared/PassengerSelector.jsx';
import BagSelector from '../shared/BagSelector.jsx';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LuggageIcon from '@mui/icons-material/Luggage';
import {airpotCodes} from '../../airportcodes.js'
import {useInput} from '../InputContext.js'

const SearchForm = ({
    handleSubmit
  }) => {

  const {searchInputs, setSearchInputs} = useInput({})
  const [passengerAnchorEl, setPassengerAnchorEl] = useState(null);
  const [bagAnchorEl, setBagAnchorEl] = useState(null);

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
        Search fake flights in the USA using an AI assistant
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
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <AirportAutocomplete
          placeholderText={"Flying To..."}
          takeOff={false}
        />
      </Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <DatePicker
          selected={searchInputs.start_date}
          onChange={(date) => setSearchInputs(prev=>({...prev, 'start_date': date}))}
          selectsStart
          startDate={searchInputs.start_date}
          endDate={searchInputs.return_date}
          placeholderText="Start Date"
          customInput={
            <TextField
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <EventIcon sx={{ mr: 1 }} />,
              }}
            />
          }
        />
        {searchInputs.trip_type === 'Round-trip' && (
          <DatePicker
            selected={searchInputs.return_date}
            onChange={(date) => setSearchInputs(prev=>({...prev, "return_date": date}))}
            selectsEnd
            startDate={searchInputs.return_date}
            endDate={searchInputs.return_date}
            minDate={searchInputs.start_date}
            placeholderText="End Date"
            customInput={
              <TextField
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <EventIcon sx={{ mr: 1 }} />,
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