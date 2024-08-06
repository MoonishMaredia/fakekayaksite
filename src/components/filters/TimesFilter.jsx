import React from 'react';
import { Slider } from '@mui/material';
import { FlightTakeoff, FlightLand } from '@mui/icons-material';

const TimesFilter = ({ timeFilter, setTimeFilter }) => {
  const handleDepartureChange = (event, newValue) => {
    setTimeFilter(prev => ({ ...prev, departure: newValue }));
  };

  const handleArrivalChange = (event, newValue) => {
    setTimeFilter(prev => ({ ...prev, arrival: newValue }));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };

  return (
    <div className="times-filter">
      <p>Houston to Phoenix</p>
      <div className="time-slider">
        <div className="time-slider-header">
          <FlightTakeoff />
          <span>Departure - {formatTime(timeFilter.departure[0])} - {formatTime(timeFilter.departure[1])}</span>
        </div>
        <Slider
          value={timeFilter.departure}
          onChange={handleDepartureChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTime}
          min={0}
          max={24}
          step={0.5}
          sx={{
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
          }}
        />
      </div>
      <div className="time-slider">
        <div className="time-slider-header">
          <FlightLand />
          <span>Arrival - {formatTime(timeFilter.arrival[0])} - {formatTime(timeFilter.arrival[1])}</span>
        </div>
        <Slider
          value={timeFilter.arrival}
          onChange={handleArrivalChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTime}
          min={0}
          max={24}
          step={0.5}
          sx={{
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(TimesFilter);