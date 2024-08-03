import React, { useState } from 'react';
import { Box, TextField, InputAdornment, MenuItem, Popover } from '@mui/material';
import { ArrowDropDown, Person, FlightTakeoff, LuggageOutlined } from '@mui/icons-material';
import PassengerSelector from './PassengerSelector';
import BagSelector from './BagSelector';

const customStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none', // Remove the border
      },
      '&:hover fieldset': {
        border: 'none', // Ensure no border on hover
      },
      '&.Mui-focused fieldset': {
        border: 'none', // Ensure no border when focused
      },
    },
    '&:hover': {
      backgroundColor: 'rgb(226 232 240)', // Background color on hover
    },
    '& .MuiInputBase-input': {
        cursor: 'pointer', // Ensures cursor changes to pointer inside the input
    },
  };

const TripOptionsBar = ({ 
  tripType, setTripType, 
  passengers, setPassengers, 
  seatType, setSeatType, 
  carryOnBags, setCarryOnBags, 
  checkedBags, setCheckedBags 
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

  const passengerOpen = Boolean(passengerAnchorEl);
  const bagOpen = Boolean(bagAnchorEl);
  const totalBags = carryOnBags + checkedBags;

  return (
    <Box sx={{ display: 'flex', gap: 0, width: '50%' }}>
      <TextField
        size="small"
        sx={{...customStyles, cursor:"pointer", width: '33%'}}
        select
        value={tripType}
        onChange={(e) => setTripType(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FlightTakeoff fontSize="small" />
            </InputAdornment>
          ),
          style: { fontSize: '0.875em' },
          readOnly: false,
        }}
        SelectProps={{
          IconComponent: () => <ArrowDropDown sx={{paddingRight: "10px", color:"gray"}} fontSize="small" />,
        }}
      >
        <MenuItem value="Round-trip">Round trip</MenuItem>
        <MenuItem value="One-way">One way</MenuItem>
      </TextField>
      <TextField
        size="small"
        sx={{...customStyles, width:"33%", cursor:"pointer"}}
        value={`${passengers} passenger${passengers > 1 ? 's' : ''}, ${seatType}`}
        onClick={handlePassengerClick}
        InputProps={{
          startAdornment: <Person fontSize="small" sx={{ mr: 1 }} />,
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDown fontSize="small" />
            </InputAdornment>
          ),
          style: { fontSize: '0.875rem' },
          readOnly: true,
        }}
      />
      <TextField
        size="small"
        sx={{...customStyles, width:"33%", cursor:"pointer"}}
        value={`${totalBags} bag${totalBags !== 1 ? 's' : ''}`}
        onClick={handleBagClick}
        InputProps={{
          startAdornment: <LuggageOutlined sx={{ mr: 1 }} />,
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDown fontSize="small" />
            </InputAdornment>
          ),
          style: { fontSize: '0.875rem' },
          readOnly: true,
        }}
      />
      <Popover
        open={passengerOpen}
        anchorEl={passengerAnchorEl}
        onClose={handlePassengerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <PassengerSelector
          passengers={passengers}
          setPassengers={setPassengers}
          seatType={seatType}
          setSeatType={setSeatType}
        />
      </Popover>
      <Popover
        open={bagOpen}
        anchorEl={bagAnchorEl}
        onClose={handleBagClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <BagSelector
          carryOnBags={carryOnBags}
          setCarryOnBags={setCarryOnBags}
          checkedBags={checkedBags}
          setCheckedBags={setCheckedBags}
        />
      </Popover>
    </Box>
  );
};

export default TripOptionsBar;