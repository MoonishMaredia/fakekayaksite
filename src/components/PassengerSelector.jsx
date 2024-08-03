import React from 'react';
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PassengerSelector = ({passengers, setPassengers, seatType, setSeatType}) => {
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

export default PassengerSelector;