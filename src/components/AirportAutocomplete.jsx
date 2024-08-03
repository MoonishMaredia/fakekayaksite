import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import {FlightLand} from '@mui/icons-material';
import { airportCodesArray } from '../busyairportcodes.js';

const AirportAutocomplete = ({ inputValue, setInputValue, placeholderText, takeOff }) => {
  const [value, setValue] = useState(null);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      options={airportCodesArray}
      filterOptions={(options, state) =>
        options.filter(option => 
          option.lookup.toLowerCase().includes(state.inputValue.toLowerCase())
        )
      }
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.key}>
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholderText}
          InputProps={{
            ...params.InputProps,
            startAdornment: takeOff ? <FlightTakeoff fontSize="small" sx={{ mr: 1 }} /> : <FlightLand fontSize="small" sx={{ mr: 1 }} />,
            style: { fontSize: '0.9rem' },
          }}
        />
      )}
    />
  );
};

export default AirportAutocomplete;