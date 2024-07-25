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

const SearchForm = () => {
  const [tripType, setTripType] = useState('Round-trip');
  const [bags, setBags] = useState('0 bags');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handlePassengerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePassengerClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Typography variant="h4" component="h1" sx={{textAlign:'center'}}gutterBottom>
        Search flights using AI assistant
      </Typography>
      <Box sx={{ mb: 2, mt:6}}>
        <Select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          displayEmpty
          variant="outlined"
          sx={{ mr: 1 }}
        >
          <MenuItem value="Round-trip">Round-trip</MenuItem>
          <MenuItem value="One-way">One-way</MenuItem>
        </Select>
        <Select
          value={bags}
          onChange={(e) => setBags(e.target.value)}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="0 bags">0 bags</MenuItem>
          <MenuItem value="1 bag">1 bag</MenuItem>
          <MenuItem value="2 bags">2 bags</MenuItem>
        </Select>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Houston, TX - George Bush Intcntl (IAH)"
          InputProps={{
            startAdornment: <FlightTakeoffIcon sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Santa Ana, CA - J. Wayne/Orange Cnty ..."
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
          endDate={endDate}
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
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
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
          open={open}
          anchorEl={anchorEl}
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
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch />}
          label="Nonstop only"
          labelPlacement="start"
          sx={{ ml: 0, justifyContent: 'space-between', width: '100%' }}
        />
      </Box>
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