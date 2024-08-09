// FlightCardDesktop.js
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
import {useResults} from './ResultsContext.js'


export default function FlightCardDesktop({ flightData, expanded, handleExpandClick, memoizedStartTime, memoizedEndTime, memoizedDuration, stopsDetailText}) {

  const {searchInputs} = useInput({})
  const {results} = useResults({})

  return (
  <Grid container spacing={2} alignItems="center">
    {expanded ? (
      <>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
          <img src={flightData['airline_logo']} width="40%" height="auto" alt={flightData['airline']} />
        </Grid>
        <Grid
            sx={{ display: "flex", justifyContent: "left" }}
            item xs={4} alignItems="center">
            <Typography variant="subtitle1" fontWeight="medium">
                Departure · {new Date(flightData['start_time']).toLocaleDateString()}
            </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2} sx={{display: 'flex', justifyContent:"flex-end"}}>
          <Button sx={{fontSize:"12px", borderRadius: "10px"}} variant="outlined" color="primary">
            Select flight
          </Button>
        </Grid>
      </>
    ) : (
      <>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
            <img src={flightData['airline_logo']} width="40%" height="auto" alt={flightData['airline']} />
        </Grid>
        <Grid
            sx={{ display: "flex", justifyContent: "left" }}
            item xs={3} alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {`${memoizedStartTime} → ${memoizedEndTime}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightData['airline']}
              </Typography>
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
      </>
    )}
    <Grid item xs={3}>
      <Typography variant="h7" fontWeight="bold">
        ${flightData.totalFlightCost} <Typography sx={{display:"inline"}}> / {searchInputs['trip_type']==="Round-trip" ? "departing" : "one-way"} </Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Flight Cost: ${flightData.adjTripCost}, Bag Fees: ${flightData.bagFees + flightData.checkedFees}
      </Typography> 
    </Grid>
    <Grid item xs={0.5} alignItems="center">
      <IconButton
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Grid>
  </Grid>
)
};