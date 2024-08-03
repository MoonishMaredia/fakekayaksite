import React from 'react';
import { Box, Paper } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AirportAutocomplete from './AirportAutocomplete';
import {TextField} from '@mui/material';
import {CalendarToday} from '@mui/icons-material';

const FlightSearchBar = ({
  isMobile,
  tripType,
  flyingFrom,
  setFlyingFrom,
  flyingTo,
  setFlyingTo,
  startDate,
  setStartDate,
  returnDate,
  setReturnDate
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        '& > *': { width: isMobile ? '100%' : '25%' },
      }}
    >
      <Box>
        <AirportAutocomplete
          inputValue={flyingFrom}
          setInputValue={setFlyingFrom}
          placeholderText={"Flying From..."}
          takeOff={true}
        />
      </Box>
      <Box>
        <AirportAutocomplete
          inputValue={flyingTo}
          setInputValue={setFlyingTo}
          placeholderText={'Flying To...'}
          takeOff={false}
        />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        width: isMobile ? '100%' : '50%',
        gap: 2,
        '& .MuiTextField-root': { borderRadius: 4 },
      }}>
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
            InputProps={{
                startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1 }} />,
                style: { fontSize: '0.9rem' },
            }}
            />
        }
        />
        {tripType === 'Round-trip' && (
        <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={returnDate}
            placeholderText="Return Date"
            minDate={startDate}
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
    </Paper>
  );
};

export default FlightSearchBar;