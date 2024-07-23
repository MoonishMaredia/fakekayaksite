import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Switch,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const LandingPage = () => {
  const [tripType, setTripType] = useState('Round-trip');
  const [bags, setBags] = useState('0 bags');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            K
          </Typography>
          <IconButton color="inherit">
            <FavoriteIcon />
          </IconButton>
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Compare flights from 100s of sites.
        </Typography>
        <Box sx={{ mb: 2 }}>
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
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Mon 7/29 - Mon 8/5"
            InputProps={{
              startAdornment: <EventIcon sx={{ mr: 1 }} />,
            }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="1 adult, Economy"
            InputProps={{
              startAdornment: <PersonOutlineIcon sx={{ mr: 1 }} />,
            }}
          />
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
      </Container>
    </Box>
  );
};

export default LandingPage;