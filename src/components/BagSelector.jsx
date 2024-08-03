import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';

const BagSelector = ({ carryOnBags, setCarryOnBags, checkedBags, setCheckedBags }) => {
  return (
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
  );
};

export default BagSelector;