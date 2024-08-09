import React from 'react';
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {useInput} from './InputContext.js'

const PassengerSelector = ({passengers, setPassengers, seatType, setSeatType}) => {

  const {searchInputs, setSearchInputs} = useInput({})

  return (
    <Box sx={{ p: 2, minWidth: 250 }}>
      <Typography variant="subtitle1" gutterBottom>Passengers</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setSearchInputs(prev=> ({...prev, num_passengers: Math.max(1, searchInputs.num_passengers - 1)}))}>
          -
        </IconButton>
        <Typography sx={{ mx: 2 }}>{searchInputs.num_passengers}</Typography>
        <IconButton onClick={() => setSearchInputs(prev=> ({...prev, num_passengers: Math.min(10, searchInputs.num_passengers + 1)}))}>
          +
        </IconButton>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="seat-type-label">Seat Type</InputLabel>
        <Select
          labelId="seat-type-label"
          value={searchInputs.seat_type}
          label="Seat Type"
          onChange={(e) => setSearchInputs(prev=>({...prev, seat_type: e.target.value}))}
        >
          <MenuItem value="Economy">Economy</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default PassengerSelector;