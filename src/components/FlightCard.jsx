import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Stack,
  Button,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WarningIcon from '@mui/icons-material/Warning';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

const FlightCard = ({ isMobile, flightData }) => {

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const memoizedStartTime = useMemo(() => formatTime(flightData['start_time']), [flightData]);
  const memoizedEndTime = useMemo(() => formatTime(flightData['end_time']), [flightData]);

  const formatDuration = (durationMinutes, short=false) => {
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    if(short) {
      return `${hours} hr ${minutes} min`
    } else {
      return `${hours} hours ${minutes} min`
    }
  }

  const memoizedDuration = useMemo(()=>formatDuration(flightData['total_duration']), [flightData])

  const getStopsText = () => {
    if(flightData['num_stops']===0) {
      return ""
    } else if(flightData['num_stops']===1) {
      return `${formatDuration(flightData['layover'][0]['duration'], true)} in ${flightData['layover'][0]['id']}`
    } else if(flightData['num_stops']>1) {
      return flightData['layover'].reduce((a,b)=> a + b.id + ", ", "").slice(0,-2)
  }
}

const stopsDetailText = useMemo(()=>getStopsText(), [flightData])


  // Carry-on fees data
  const carryOnFees = {
    Spirit: [50]
  };

  // Checked fees data
  const checkedFees = {
    Alaska: [35, 45, 150],
    American: [35, 45, 150],
    Delta: [35, 45, 150],
    Frontier: [70, 90, 100],
    Hawaiian: [25, 40, 100],
    JetBlue: [40, 60, 125],
    Southwest: [0, 0, 125],
    Spirit: [55, 80, 90]
  };

  // Function to get carry-on fees
  const getCarryFees = (airline, numBags) => {
    if (carryOnFees.hasOwnProperty(airline)) {
      return carryOnFees[airline][0] * numBags;
    } else {
      return 0;
    }
  };

  // Function to get checked fees
  const getCheckedFees = (airline, numBags) => {
    if (checkedFees.hasOwnProperty(airline)) {
      return checkedFees[airline].slice(0, numBags).reduce((a, b) => a + b, 0);
    } else {
      return checkedFees['American'].slice(0, numBags).reduce((a, b) => a + b, 0);
    }
  };

  const checkedBagFees = React.useMemo(()=>getCheckedFees(flightData['airline'], 1,[flightData]))
  const carryOnBagFees = React.useMemo(()=>getCarryFees(flightData['airline'], 1,[flightData]))

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {isMobile ? (
          // Mobile view
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <Typography variant="h8" sx={{fontSize:"14px"}} fontWeight="medium">
                {`${memoizedStartTime} → ${memoizedEndTime}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IAH
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <img style={{ marginRight: "5px" }} src={flightData['airline_logo']} width="25px" />
                <Box display="flex" flexDirection="column" ml={1}>
                  <Typography sx={{fontSize:"12px"}} variant="body2">
                    1 stop in DEN
                  </Typography>
                  <Typography sx={{fontSize:"12px"}} variant="body2">
                    {flightData['airline']}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <Typography sx={{fontSize:'14px'}} variant="h8" fontWeight="medium">
                  ${flightData['trip_cost']}
                </Typography>
                <Typography sx={{display:"inline", fontSize:'12px'}}> / round trip</Typography>
                <Typography variant="body2" sx={{fontSize:'10px'}} color="text.secondary">
                  Trip Cost: ${flightData['trip_cost']}, Bag Fees: ${carryOnBagFees + checkedBagFees}
                </Typography>
                <IconButton
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                  size="small"
                  sx={{mt:1}}
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        ) : (
          // Desktop view
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Box display="flex" alignItems="center">
                <img style={{ marginRight: "10px" }} src={flightData['airline_logo']} width="25px" />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {`${memoizedStartTime} → ${memoizedEndTime}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flightData['airline']}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="medium">
                {memoizedDuration}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                MIA–JFK
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="medium">
                {flightData['num_stops']===0 ? "Nonstop" : `${flightData['num_stops']} stop`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stopsDetailText}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold">
                ${flightData['trip_cost'] + carryOnBagFees + checkedBagFees} <Typography sx={{display:"inline"}}> / total round trip</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trip Cost: ${flightData['trip_cost']}, Bag Fees: ${carryOnBagFees + checkedBagFees}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Grid>
          </Grid>
        )}
      </CardContent>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          {/* Detailed flight information (your previous implementation) */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button variant="outlined" color="primary">
              Select flight
            </Button>
          </Box>
          
          <Box my={2} >
            <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium">11:17 AM · George Bush Intercontinental Airport (IAH)</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>Travel time: 2 hr 34 min</Typography>
            <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium" mt={2}>12:51 PM · Denver International Airport (DEN)</Typography>
            
            <Stack direction="row" spacing={1} mt={1}>
              <Typography variant="body2">Frontier · Economy · Airbus A320neo · F9 3227</Typography>
            </Stack>
            <Typography variant="body2" color="error" mt={1}>
              <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Often delayed by 30+ min
            </Typography>
          </Box>
          
          <Divider />
          <Typography variant="body2" fontWeight="medium" my={2}>
            1 hr 59 min layover · Denver (DEN)
          </Typography>
          <Divider />
          <Box my={2}>
            <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium">2:50 PM · Denver International Airport (DEN)</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>Travel time: 1 hr 55 min</Typography>
            <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium" mt={2}>3:45 PM · Phoenix Sky Harbor International Airport (PHX)</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Typography variant="body2">Frontier · Economy · Airbus A320neo · F9 2141</Typography>
            </Stack>
            <Typography variant="body2" color="error" mt={1}>
              <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Often delayed by 30+ min
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FlightCard;