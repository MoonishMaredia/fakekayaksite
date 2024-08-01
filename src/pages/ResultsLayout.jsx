import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Paper,
  Grid,
  Select,
  MenuItem,
  Popover,
  InputLabel,
  FormControl,
  Modal,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Switch, 
  InputAdornment,
  Autocomplete,
  useMediaQuery, useTheme
} from '@mui/material';
import {
  ArrowDropDown,
  CompareArrows,
  CalendarToday,
  Person,
  FlightTakeoff,
  FlightLand,
  LuggageOutlined,
  Close,
} from '@mui/icons-material';
import LuggageIcon from '@mui/icons-material/Luggage';
import {airportCodes} from '../busyairportcodes.js'
import {airportCodesArray} from '../busyairportcodes.js'

const customStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none', // Remove the border
      },
      '&:hover fieldset': {
        border: 'none', // Ensure no border on hover
      },
      '&.Mui-focused fieldset': {
        border: 'none', // Ensure no border when focused
      },
    },
    '&:hover': {
      backgroundColor: 'rgb(226 232 240)', // Background color on hover
    },
    '& .MuiInputBase-input': {
        cursor: 'pointer', // Ensures cursor changes to pointer inside the input
    },
  };


const FlightResultsPage = () => {
  const [tripType, setTripType] = useState('Round-trip');
  const [flyingFrom, setFlyingFrom] = useState('');
  const [flyingTo, setFlyingTo] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [seatType, setSeatType] = useState('Economy');
  const [carryOnBags, setCarryOnBags] = useState(0);
  const [checkedBags, setCheckedBags] = useState(0);

  const [passengerAnchorEl, setPassengerAnchorEl] = useState(null);
  const [bagAnchorEl, setBagAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleOpenModal = (modalName) => {
    setOpenModal(modalName);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const passengerOpen = Boolean(passengerAnchorEl);
  const bagOpen = Boolean(bagAnchorEl);
  const totalBags = carryOnBags + checkedBags;

  const isFormValid = () => {
    // Check for empty strings, null or undefined
    if (!tripType || !flyingFrom || !flyingTo || !startDate || !passengers || !seatType || carryOnBags === null || checkedBags === null) {
      return false;
    }
  
    // Check for Round-trip specific condition
    if (tripType === 'Round-trip' && !returnDate) {
      return false;
    }
  
    // Check implicit conditions from the provided functions
    if (!['Round-trip', 'One-way'].includes(tripType)) return false;
    if (!airportCodes.hasOwnProperty(flyingFrom) || !airportCodes.hasOwnProperty(flyingTo)) return false;
    if (flyingFrom === flyingTo) return false;
    if (startDate < new Date()) return false;
    if (tripType === 'Round-trip' && returnDate < startDate) return false;
    if (passengers < 1 || passengers > 10) return false;
    if (!['Economy', 'Business', 'First'].includes(seatType)) return false;
    if (carryOnBags < 0 || carryOnBags > 1) return false;
    if (checkedBags < 0 || checkedBags > 5) return false;
  
    return true;
  };

  return (
    <Box sx={{ p: 2, 
                width: isMobile ? '90vw' : '70vw', 
                margin: '20px auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1 }}>
      {/* Topmost menu items */}
      <Box sx={{ display: 'flex', 
                gap: 0,
                width: isMobile ? '100%' : '50%' 
                }}>
            <TextField
                size="small"
                sx={{...customStyles, cursor:"pointer", width: '33%'}}
                select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <FlightTakeoff fontSize="small" />
                    </InputAdornment>
                ),
                style: { fontSize: '0.875em' },
                readOnly: false, // Ensure it's editable
                }}
                SelectProps={{
                IconComponent: () => <ArrowDropDown sx={{paddingRight: "10px", color:"gray"}} fontSize="small" />, // Customize dropdown arrow if needed
                }}>
                <MenuItem value="Round-trip">Round trip</MenuItem>
                <MenuItem value="One-way">One way</MenuItem>
            </TextField>
        <TextField
        size="small"
        sx={{...customStyles, 
            width:"33%", 
            cursor:"pointer",
            }}
        value={`${passengers} passenger${passengers > 1 ? 's' : ''}, ${seatType}`}
        onClick={handlePassengerClick}
        InputProps={{
            startAdornment: <Person fontSize="small" sx={{ mr: 1 }} />,
            endAdornment: (
            <InputAdornment position="end">
                <ArrowDropDown fontSize="small" />
            </InputAdornment>
            ),
            style: { fontSize: '0.875rem' },
            readOnly: true,
        }}
        />

        <TextField
        size="small"
        sx={{...customStyles, width:"33%", cursor:"pointer"}}
        value={`${totalBags} bag${totalBags !== 1 ? 's' : ''}`}
        onClick={handleBagClick}
        InputProps={{
            startAdornment: <LuggageOutlined sx={{ mr: 1 }} />,
            endAdornment: (
            <InputAdornment position="end">
                <ArrowDropDown fontSize="small" />
            </InputAdornment>
            ),
            style: { fontSize: '0.875rem' },
            readOnly: true,
        }}
        />
      </Box>

      <Paper 
            elevation={0} 
            sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                '& > *': { width: isMobile ? '100%' : '25%' }
            }}
            >
            <Box>
                <AirportAutocomplete
                inputValue={flyingFrom}
                setInputValue={setFlyingFrom}
                options={airportCodesArray}
                placeholderText={"Flying From..."}
                />
            </Box>
            <Box>
                <AirportAutocomplete
                inputValue={flyingTo}
                setInputValue={setFlyingTo}
                options={airportCodesArray}
                placeholderText={'Flying To...'}
                />
            </Box>
            <Box sx={{ 
                display: 'flex', 
                width: isMobile ? '100%' : '50%',
                gap: 2,  // This adds space between the date pickers
                '& .MuiTextField-root': { borderRadius: 4 },  // Restore default border radius
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
      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 1, overflowX: 'auto', alignItems: 'center' }}>
        <Chip label="All filters" color="primary" variant="outlined" />
        {['Stops', 'Airlines', 'Price', 'Times', 'Connecting airports', 'Duration'].map((filter) => (
            <Chip
                key={filter}
                label={filter}
                onClick={() => handleOpenModal(filter)}
                deleteIcon={<ArrowDropDown />}
                onDelete={() => handleOpenModal(filter)}
                sx={{
                    width: filter === "Connecting airports" ? "250px" : "125px",
                    fontSize: "0.925rem",
                    borderRadius: "5px",
                    height: "40px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    border: "1px solid rgb(203 213 225)",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Space between text and delete icon
                    textAlign: 'left', // Align text to the left
                    paddingLeft: '5px', // Add some padding to ensure the text doesn’t touch the border
            }}
            />
        ))}
      </Box>

      {/* Flight cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Best departing flights</Typography>
        {/* Example flight cards */}
        {[1, 2, 3].map((flight) => (
          <Paper key={flight} sx={{ p: 2 }}>
            <Typography variant="body1">Flight {flight}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Passenger Popover */}
      <Popover
        open={passengerOpen}
        anchorEl={passengerAnchorEl}
        onClose={handlePassengerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <PassengerSelector
          passengers={passengers}
          setPassengers={setPassengers}
          seatType={seatType}
          setSeatType={setSeatType}
        />
      </Popover>

      {/* Bag Popover */}
      <Popover
        open={bagOpen}
        anchorEl={bagAnchorEl}
        onClose={handleBagClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <BagSelector
          carryOnBags={carryOnBags}
          setCarryOnBags={setCarryOnBags}
          checkedBags={checkedBags}
          setCheckedBags={setCheckedBags}
        />
      </Popover>

      {/* Filter Modals */}
      <Modal
        open={openModal !== null}
        onClose={handleCloseModal}
        aria-labelledby="filter-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="filter-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {openModal}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          {openModal === 'Price' && <PriceFilter />}
          {openModal === 'Stops' && <StopsFilter />}
          {openModal === 'Airlines' && <AirlinesFilter />}
          {/* Add more filter components as needed */}
        </Box>
      </Modal>
    </Box>
  );
};

function PassengerSelector({passengers, setPassengers, seatType, setSeatType}) {
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

function BagSelector({ carryOnBags, setCarryOnBags, checkedBags, setCheckedBags }) {

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
    )
};

const PriceFilter = () => {
  const [price, setPrice] = useState(2200);

  return (
    <Box>
      <Typography gutterBottom>Up to ${price}</Typography>
      <Slider
        value={price}
        onChange={(_, newValue) => setPrice(newValue)}
        max={2200}
        aria-labelledby="price-slider"
      />
      <Button variant="text" sx={{ mt: 2 }}>Clear</Button>
    </Box>
  );
};

const StopsFilter = () => {
  const [stops, setStops] = useState('any');

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="stops"
        name="stops"
        value={stops}
        onChange={(e) => setStops(e.target.value)}
      >
        <FormControlLabel value="any" control={<Radio />} label="Any number of stops" />
        <FormControlLabel value="nonstop" control={<Radio />} label="Nonstop only" />
        <FormControlLabel value="1stop" control={<Radio />} label="1 stop or fewer" />
        <FormControlLabel value="2stops" control={<Radio />} label="2 stops or fewer" />
      </RadioGroup>
    </FormControl>
  );
};

const AirlinesFilter = () => {
  const [selectAll, setSelectAll] = useState(true);
  const airlines = ['Alaska', 'American', 'Delta', 'Emirates', 'Frontier', 'JetBlue', 'Qatar Airways', 'United'];

  return (
    <Box>
      <FormControlLabel
        control={<Switch checked={selectAll} onChange={() => setSelectAll(!selectAll)} />}
        label="Select all airlines"
      />
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Alliances</Typography>
      {['Oneworld', 'SkyTeam', 'Star Alliance'].map((alliance) => (
        <FormControlLabel key={alliance} control={<Checkbox />} label={alliance} />
      ))}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Airlines</Typography>
      {airlines.map((airline) => (
        <FormControlLabel key={airline} control={<Checkbox checked={selectAll} />} label={airline} />
      ))}
      <Button variant="text" sx={{ mt: 2 }}>Clear</Button>
    </Box>
  );
};


function AirportAutocomplete({ inputValue, setInputValue, options, placeholderText }) {
    const [value, setValue] = useState(null);
  
    return (
      <Autocomplete
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        options={options}
        filterOptions={(options, state) =>
          options.filter(option => 
            option.lookup.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
        getOptionLabel={(option) => option.name} // Display the name in the input field
        renderOption={(props, option) => (
          <li {...props} key={option.key}>
            {option.name} {/* Display lookup value in the dropdown */}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholderText}
            InputProps={{
              ...params.InputProps,
              startAdornment: <FlightTakeoff fontSize="small" sx={{ mr: 1 }} />,
              style: { fontSize: '0.9rem' },
            }}
          />
        )}
      />
    );
  };

export default FlightResultsPage;