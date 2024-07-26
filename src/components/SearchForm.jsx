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
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LuggageIcon from '@mui/icons-material/Luggage';

const SearchForm = ({
    tripType, setTripType,
    flyingFrom, setFlyingFrom,
    flyingTo, setFlyingTo,
    startDate, setStartDate,
    returnDate, setReturnDate,
    adults, setAdults,
    children, setChildren,
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

  const passengerOpen = Boolean(passengerAnchorEl);
  const bagOpen = Boolean(bagAnchorEl);
  const totalBags = carryOnBags + checkedBags;

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }} gutterBottom>
        Search flights using AI assistant
      </Typography>
      <Box sx={{ mb: 2, mt: 6, display: 'flex', alignItems: 'center' }}>
        <Select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          display="Round-trip"
          variant="outlined"
          sx={{ mr: 1, width: '50%' }}
        >
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
          value={`${adults + children} passenger${adults + children > 1 ? 's' : ''}, Economy`}
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
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Adults (2+)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton onClick={() => setAdults(Math.max(1, adults - 1))}>-</IconButton>
              <Typography sx={{ mx: 2 }}>{adults}</Typography>
              <IconButton onClick={() => setAdults(adults + 1)}>+</IconButton>
            </Box>
            <Typography>Children ({'<'}2)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => setChildren(Math.max(0, children - 1))}>-</IconButton>
              <Typography sx={{ mx: 2 }}>{children}</Typography>
              <IconButton onClick={() => setChildren(children + 1)}>+</IconButton>
            </Box>
          </Box>
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
            <IconButton onClick={() => setCheckedBags(Math.min(5, checkedBags + 1))}>+</IconButton>
          </Box>
        </Box>
      </Popover>
      {/* <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch />}
          label="Nonstop only"
          labelPlacement="start"
          sx={{ ml: 0, justifyContent: 'space-between', width: '100%' }}
        />
      </Box> */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          backgroundColor: '#FF6B00',
          '&:hover': {
            backgroundColor: '#E66000',
          },
        }}
      >
        Search
      </Button>
    </>
  );
};

export default SearchForm;
