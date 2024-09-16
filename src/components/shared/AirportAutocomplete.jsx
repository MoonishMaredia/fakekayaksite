import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FlightTakeoff, FlightLand } from '@mui/icons-material';
import { airportCodes } from '../../busyairportcodes.js';
import { airportCodesArray } from '../../busyairportcodes.js';
import { useInput } from '../InputContext.js'

// GUI component that allows user to input airport by searching airport name, city or code
const AirportAutocomplete = ({ placeholderText, takeOff, handleAirportChange }) => {
  const { searchInputs, setSearchInputs } = useInput({})
  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState(null)

  useEffect(() => {
    const initialValue = takeOff ? searchInputs['flying_from'] : searchInputs['flying_to']
    if (initialValue) {
      setInputValue(airportCodes[initialValue]?.name || '')
      setValue(airportCodesArray.find(option => option.key === initialValue) || null)
    }
  }, [takeOff, searchInputs])

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue)
  }

  async function handleChange(event, newValue) {
    setValue(newValue)
    if (newValue) {
      await handleAirportChange(takeOff, newValue.key)
    }
  }

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
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