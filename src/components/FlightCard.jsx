import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  Typography,
  Button,
  Stack
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import FlightCardMobile from './FlightCardMobile';
import FlightCardDesktop from './FlightCardDesktop';
import { airportCodes } from '../busyairportcodes.js';



const FlightCard = ({ isMobile, flightData }) => {

  // console.log(flightData['layover'][0].duration)

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
  const getCarryFees = (airline, numBags, roundTrip=true) => {
    if (carryOnFees.hasOwnProperty(airline)) {
        return carryOnFees[airline][0] * numBags;
    } else {
    return 0;
  }
};

  // Function to get checked fees
  const getCheckedFees = (airline, numBags, roundTrip=true) => {
    if (checkedFees.hasOwnProperty(airline)) {
        return checkedFees[airline].slice(0, numBags).reduce((a, b) => a + b, 0);
      } else {
        return checkedFees['American'].slice(0, numBags).reduce((a, b) => a + b, 0);
      }
  } 

  const checkedBagFees = React.useMemo(()=>getCheckedFees(flightData['airline'], 1,[flightData]))
  const carryOnBagFees = React.useMemo(()=>getCarryFees(flightData['airline'], 1,[flightData]))

  return (
    <Card>
      <CardContent id="summary-card" sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {isMobile ? (
          <FlightCardMobile
            flightData={flightData}
            expanded={expanded}
            handleExpandClick={handleExpandClick}
            memoizedStartTime={memoizedStartTime}
            memoizedEndTime={memoizedEndTime}
            carryOnBagFees={carryOnBagFees}
            checkedBagFees={checkedBagFees}
            stopsDetailText={stopsDetailText}
          />
        ) : (
          <FlightCardDesktop
            flightData={flightData}
            expanded={expanded}
            handleExpandClick={handleExpandClick}
            memoizedStartTime={memoizedStartTime}
            memoizedEndTime={memoizedEndTime}
            memoizedDuration={memoizedDuration}
            stopsDetailText={stopsDetailText}
            carryOnBagFees={carryOnBagFees}
            checkedBagFees={checkedBagFees}
          />
        )}
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          {/* Detailed flight information (your previous implementation) */}
          {isMobile && <Box display="flex" justifyContent="space-between" alignItems="left" mb={2}>
            <Button sx={{fontSize: "10px"}} variant="outlined" color="primary">
              Select flight
            </Button>
          </Box>}
          
          {flightData['flights'].map((flightLeg, index) => (
            <React.Fragment key={index}>
              <Box my={2} >
                <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium">{formatTime(flightLeg['start_time'])} · {airportCodes[flightLeg['start_airport']].name} ({flightLeg['start_airport']})</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>Travel time: {formatDuration(flightLeg['duration'])}</Typography>
                <Typography sx={{fontSize: isMobile ? "14px" : "16px"}} variant="body1" fontWeight="medium" mt={2}>{formatTime(flightLeg['end_time'])} · {airportCodes[flightLeg['end_airport']].name} ({flightLeg['end_airport']})</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Typography variant="body2" color="text.secondary">{flightLeg['airline']} · Economy · {flightLeg['airplane']} · {flightLeg['flight_number']}</Typography>
                </Stack>
              </Box>
              {index < flightData['num_stops'] && (
                <React.Fragment>
                  <Divider />
                  <Typography variant="body2" fontWeight="medium" my={2}>
                    {formatDuration(flightData['layover'][index].duration)} layover · {airportCodes[flightData['layover'][index].id].name} ({flightData['layover'][index].id})
                    {flightData['layover'][index].overnight &&
                    <Typography variant="body2" color="error" mt={1}>
                      <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Overnight Layover
                    </Typography>
                    }
                  </Typography>
                  <Divider />
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FlightCard;