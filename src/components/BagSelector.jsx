import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';
import {useInput} from './InputContext.js'

const BagSelector = () => {

  const {searchInputs, setSearchInputs} = useInput({})

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Baggage per passenger</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <LuggageIcon />
        <Typography sx={{ mx: 2 }}>Carry-on bag</Typography>
        <IconButton onClick={() => setSearchInputs(prev=>({...prev, num_carryOn: Math.max(0, searchInputs.num_carryOn - 1)}))}>-</IconButton>
        <Typography sx={{ mx: 2 }}>{searchInputs.num_carryOn}</Typography>
        <IconButton onClick={() => setSearchInputs(prev=>({...prev, num_carryOn: Math.min(1, searchInputs.num_carryOn + 1)}))}>+</IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LuggageIcon />
        <Typography sx={{ mx: 2 }}>Checked bag</Typography>
        <IconButton onClick={() => setSearchInputs(prev=>({...prev, num_checked: Math.max(0, searchInputs.num_checked - 1)}))}>-</IconButton>
        <Typography sx={{ mx: 2 }}>{searchInputs.num_checked}</Typography>
        <IconButton onClick={() => setSearchInputs(prev=>({...prev, num_checked: Math.min(3, searchInputs.num_checked + 1)}))}>+</IconButton>
      </Box>
    </Box>
  );
};

export default BagSelector;