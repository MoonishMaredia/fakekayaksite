import React, { useState } from 'react';
import { Box, TextField, InputAdornment, MenuItem, Popover } from '@mui/material';
import { ArrowDropDown, Person, FlightTakeoff, LuggageOutlined } from '@mui/icons-material';
import PassengerSelector from '../shared/PassengerSelector';
import BagSelector from '../shared/BagSelector';
import {useInput} from '../InputContext'

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
    '& .MuiSelect-select': {
      paddingRight: '0px !important', // Force remove right padding
      paddingLeft: '5px', // Adjust as needed for left padding
    },
    '& .MuiSelect-icon': {
      right: '8px', // Adjust as needed to position the icon
    },
  };

const TripOptionsBar = ({ 
  isMobile 
}) => {

  const {searchInputs, setSearchInputs} = useInput({});
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
  const totalBags = searchInputs.num_carryOn + searchInputs.num_checked;

  return (
    <Box sx={{ display: 'flex', gap: 0, width: isMobile ? '100%' : '70%'}}>
      <TextField
        size="small"
        sx={{...customStyles, 
          cursor:"pointer", 
          width: isMobile ? '40%' : '15%',
          }}
        select
        value={searchInputs.trip_type}
        onChange={(e) => setSearchInputs((prev) => ({ ...prev, trip_type: e.target.value }))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FlightTakeoff fontSize="small" />
            </InputAdornment>
          ),
          style: { fontSize: '0.875em' },
          readOnly: false,
          inputProps: {
            style: {
              paddingRight: '0px', // Adjust as needed to reduce space
            }
          },
        }}
        SelectProps={{
          IconComponent: () => <ArrowDropDown sx={{ color:"gray"}} fontSize="small" />,
        }}
      >
        <MenuItem value="Round-trip">Round-trip</MenuItem>
        <MenuItem value="One-way">One way</MenuItem>
      </TextField>
      <TextField
        size="small"
        sx={{...customStyles, 
          width: isMobile ? '30%' : '17%', 
          cursor:"pointer"}}
        value={`${searchInputs.num_passengers}, ${searchInputs.seat_type}`}
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
        sx={{...customStyles, 
          width: isMobile ? '30%' : '15%',  
          cursor:"pointer"}}
        value={`${totalBags}`}
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
        <PassengerSelector/>
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
        <BagSelector/>
      </Popover>
    </Box>
  );
};

export default TripOptionsBar;