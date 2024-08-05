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
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LuggageIcon from '@mui/icons-material/Luggage';
import {airpotCodes} from '../airportcodes.js'

const SearchForm = ({
    tripType, setTripType,
    flyingFrom, setFlyingFrom,
    flyingTo, setFlyingTo,
    startDate, setStartDate,
    returnDate, setReturnDate,
    passengers, setPassengers,
    seatType, setSeatType,
    carryOnBags, setCarryOnBags,
    checkedBags, setCheckedBags,
  }) => {

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
    if (!tripType || !flyingFrom || !flyingTo || !startDate || !passengers || !seatType || carryOnBags === null || checkedBags === null) {
      return false;
    }
  
    // Check for Round-trip specific condition
    if (tripType === 'Round-trip' && !returnDate) {
      return false;
    }
  
    // Check implicit conditions from the provided functions
    if (!['Round-trip', 'One-way'].includes(tripType)) return false;
    if (!airpotCodes.hasOwnProperty(flyingFrom) || !airpotCodes.hasOwnProperty(flyingTo)) return false;
    if (flyingFrom === flyingTo) return false;
    if (startDate < new Date()) return false;
    if (tripType === 'Round-trip' && returnDate < startDate) return false;
    if (passengers < 1 || passengers > 10) return false;
    if (!['Economy', 'Business', 'First'].includes(seatType)) return false;
    if (carryOnBags < 0 || carryOnBags > 1) return false;
    if (checkedBags < 0 || checkedBags > 5) return false;
  
    return true;
  };

  const passengerOpen = Boolean(passengerAnchorEl);
  const bagOpen = Boolean(bagAnchorEl);
  const totalBags = carryOnBags + checkedBags;

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }} gutterBottom>
        Search fake flights in the USA using an AI assistant
      </Typography>
      <Box sx={{ mb: 2, mt: 6, display: 'flex', alignItems: 'center' }}>
      <Select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
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
        <TextField
          fullWidth
          value={flyingFrom}
          onChange={(e) => setFlyingFrom(e.target.value)}
          variant="outlined"
          placeholder="Enter US airport flying from ..."
          InputProps={{
            startAdornment: <FlightTakeoffIcon sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          value={flyingTo}
          onChange={(e) => setFlyingTo(e.target.value)}
          variant="outlined"
          placeholder="Enter US airport flying to ..."
          InputProps={{
            startAdornment: <FlightLandIcon sx={{ mr: 1 }} />,
          }}
        />
      </Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={returnDate}
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
        {tripType === 'Round-trip' && (
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            selectsEnd
            startDate={returnDate}
            endDate={returnDate}
            minDate={startDate}
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
          value={`${passengers ? passengers : 0} passenger${passengers > 1 ? 's' : ''}, ${seatType}`}
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
          <PassengerSelector
            passengers={passengers}
            setPassengers={setPassengers}
            seatType={seatType}
            setSeatType={setSeatType}
          />
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
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Baggage per passenger</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LuggageIcon />
            <Typography sx={{ mx: 2 }}>Carry-on bag</Typography>
            <IconButton onClick={() => setCarryOnBags(Math.max(0, carryOnBags - 1))}>-</IconButton>
            <Typography sx={{ mx: 2 }}>{carryOnBags}</Typography>
            <IconButton onClick={() => setCarryOnBags(Math.min(1, carryOnBags + 1))}>+</IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LuggageIcon />
            <Typography sx={{ mx: 2 }}>Checked bag</Typography>
            <IconButton onClick={() => setCheckedBags(Math.max(0, checkedBags - 1))}>-</IconButton>
            <Typography sx={{ mx: 2 }}>{checkedBags}</Typography>
            <IconButton onClick={() => setCheckedBags(Math.min(3, checkedBags + 1))}>+</IconButton>
          </Box>
        </Box>
      </Popover>
      <Button
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


function PassengerSelector({passengers, setPassengers, seatType, setSeatType}) {
  return (
    <Box sx={{ p: 2, minWidth: 250 }}>
      <Typography variant="subtitle1" gutterBottom>Passengers</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setPassengers(Math.max(1, passengers - 1))}>
          -
        </IconButton>
        <Typography sx={{ mx: 2 }}>{passengers}</Typography>
        <IconButton onClick={() => setPassengers(Math.min(10, passengers + 1))}>
          +
        </IconButton>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="seat-type-label">Seat Type</InputLabel>
        <Select
          labelId="seat-type-label"
          value={seatType}
          label="Seat Type"
          onChange={(e) => setSeatType(e.target.value)}
        >
          <MenuItem value="Economy">Economy</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
          <MenuItem value="First">First</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};