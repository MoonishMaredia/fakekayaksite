import React from 'react';
import { Box, Paper, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AirportAutocomplete from '../shared/AirportAutocomplete.jsx';
import { CalendarToday } from '@mui/icons-material';
import { useInput } from '../InputContext.js';
import moment from 'moment';

const FlightSearchBar = ({ isMobile, handleStartDateChange, handleReturnDateChange, handleAirportChange }) => {
  const { searchInputs, setSearchInputs } = useInput({});

  // Get today's date
  const today = new Date();
  // Calculate the date one year from today
  const oneYearFromToday = new Date();
  oneYearFromToday.setFullYear(today.getFullYear() + 1);

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
          placeholderText={"Flying From..."}
          takeOff={true}
          handleAirportChange={handleAirportChange}
        />
      </Box>
      <Box>
        <AirportAutocomplete
          placeholderText={'Flying To...'}
          takeOff={false}
          handleAirportChange={handleAirportChange}
        />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        width: isMobile ? '100%' : '50%',
        gap: 2,
        '& .MuiTextField-root': { borderRadius: 4 },
      }}>
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
    </Paper>
  );
};

export default FlightSearchBar;
