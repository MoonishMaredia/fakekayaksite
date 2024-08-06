import React from 'react';
import { Slider } from '@mui/material';

const TotalDurationFilter = ({ duration, setDuration, maxDuration }) => {
  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <div className="total-duration-filter">
      <p>Total Travel Duration</p>
      <div className="time-slider-total">
        <div className="time-slider-header">
          <span>{formatDuration(duration[0])} - {formatDuration(duration[1])}</span>
        </div>
        <Slider
          value={duration}
          onChange={handleDurationChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatDuration}
          min={0}
          max={maxDuration}
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

export default React.memo(TotalDurationFilter);