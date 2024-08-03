import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WarningIcon from '@mui/icons-material/Warning';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

const FlightCard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{}}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <FlightTakeoffIcon color="primary" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                11:17 AM – 3:45 PM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frontier
              </Typography>
            </Box>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              6 hr 28 min
            </Typography>
            <Typography variant="body2" color="text.secondary">
              IAH–PHX
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              1 stop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 hr 59 min DEN
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              175 kg CO2e
            </Typography>
            <Typography variant="body2" color="primary">
              +17% emissions ⓘ
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h6" fontWeight="bold">
              $153
            </Typography>
            <Typography variant="body2" color="text.secondary">
              round trip
            </Typography>
          </Box>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
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
          
          <Box my={2}>
            <Typography variant="body1" fontWeight="bold">11:17 AM · George Bush Intercontinental Airport (IAH)</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>Travel time: 2 hr 34 min</Typography>
            <Typography variant="body1" fontWeight="bold" mt={2}>12:51 PM · Denver International Airport (DEN)</Typography>
            
            <Stack direction="row" spacing={1} mt={1}>
              <Typography variant="body2">Frontier · Economy · Airbus A320neo · F9 3227</Typography>
            </Stack>
            <Typography variant="body2" color="error" mt={1}>
              <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Often delayed by 30+ min
            </Typography>
            
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Typography variant="body2" color="text.secondary" mr={2}>
                <AirlineSeatReclineNormalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Below average legroom (28 in)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emissions estimate: 100 kg CO2e ⓘ
              </Typography>
            </Box>
          </Box>
          
          <Divider />
          
          <Typography variant="body1" fontWeight="bold" my={2}>
            1 hr 59 min layover · Denver (DEN)
          </Typography>
          
          <Divider />
          
          <Box my={2}>
            <Typography variant="body1" fontWeight="bold">2:50 PM · Denver International Airport (DEN)</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>Travel time: 1 hr 55 min</Typography>
            <Typography variant="body1" fontWeight="bold" mt={2}>3:45 PM · Phoenix Sky Harbor International Airport (PHX)</Typography>
            
            <Stack direction="row" spacing={1} mt={1}>
              <Typography variant="body2">Frontier · Economy · Airbus A320neo · F9 2141</Typography>
            </Stack>
            <Typography variant="body2" color="error" mt={1}>
              <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Often delayed by 30+ min
            </Typography>
            
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Typography variant="body2" color="text.secondary" mr={2}>
                <AirlineSeatReclineNormalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Below average legroom (28 in)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emissions estimate: 75 kg CO2e ⓘ
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FlightCard;