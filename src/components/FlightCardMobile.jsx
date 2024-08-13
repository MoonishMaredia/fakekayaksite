// FlightCardMobile.js
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useInput} from './InputContext.js'

const options = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' };


export default function FlightCardMobile({ 
  flightData, expanded, 
  handleExpandClick, memoizedStartTime, 
  memoizedEndTime, memoizedDuration, 
  stopsDetailText, isReturnFlightPage
}) {
  
  const {searchInputs} = useInput({})

  return (
  <Grid container spacing={1} alignItems="flex-start">
    {expanded ? (
      <>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
          <img src={flightData['airline_logo']} width="100%" height="auto" alt={flightData['airline']} />
        </Grid>
        <Grid
            sx={{ display: "flex", justifyContent: "left" }}
            item xs={6} alignItems="center">
            <Typography sx={{fontSize:"13px"}} variant="subtitle2" fontWeight="medium">
                Departure · {isReturnFlightPage ? new Date(searchInputs.return_date).toLocaleDateString('en-US', options) : new Date(searchInputs.start_date).toLocaleDateString('en-US', options)}
            </Typography>
        </Grid>
      </>
    ) : (
      <>
        <Grid item xs={7}>
          <Typography variant="body2" fontWeight="medium">
            {`${memoizedStartTime} → ${memoizedEndTime}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {!isReturnFlightPage ? `${searchInputs.flying_from}–${searchInputs.flying_to}` : `${searchInputs.flying_to}–${searchInputs.flying_from}`}           
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
              <img src={flightData['airline_logo']} width="40px" height="auto" alt={flightData['airline']} />
            <Box display="flex" ml={1} flexDirection="column">
              <Typography variant="caption">
              {flightData['airline']}, {flightData['num_stops']===0 ? "Nonstop" : `${flightData['num_stops']} stop`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
            {stopsDetailText}
          </Typography>
            </Box>
          </Box>
        </Grid>
      </>
    )}
    <Grid item xs={4}>
      <Box justifyContent="flex-start" textAlign="left">
        <Typography sx={{fontSize:"12px"}} variant="body2" fontWeight="medium">
          ${flightData.totalFlightCost} / ${searchInputs['trip_type'] === "Round-trip" ? (isReturnFlightPage ? "returning" : "departing") : "one-way"}
        </Typography>
        <Typography sx={{fontSize:"10px"}} variant="caption" display="block">
            Trip Cost: ${flightData.adjTripCost}, Bag Fees: ${flightData.bagFees + flightData.checkedFees}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={1}>
      <IconButton
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        size="small"
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Grid>
  </Grid>
)
};
