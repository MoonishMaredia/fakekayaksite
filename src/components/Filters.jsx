import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chip } from '@mui/material';
import { Slider } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import {FlightLand} from '@mui/icons-material';
import '../FilterComponent.css'; // We'll create this CSS file for styling

const FilterComponent = () => {
    const airportsData = [
        { code: "JFK", name: "John F. Kennedy International Airport", checked: true },
        { code: "LAX", name: "Los Angeles International Airport", checked: true },
        { code: "ORD", name: "Chicago O'Hare International Airport", checked: true },
        { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", checked: true },
        { code: "DFW", name: "Dallas/Fort Worth International Airport", checked: true },
        { code: "LHR", name: "London Heathrow Airport", checked: true },
        { code: "CDG", name: "Paris Charles de Gaulle Airport", checked: true },
        { code: "HKG", name: "Hong Kong International Airport", checked: true },
        { code: "SIN", name: "Singapore Changi Airport", checked: true },
        { code: "SYD", name: "Sydney Airport", checked: true }
        ];
  const [priceFilter, setPriceFilter] = useState(2200);
  const [stopsFilter, setStopsFilter] = useState('any');
  const [airlinesFilter, setAirlinesFilter] = useState({
    airlines: {
      Alaska: true, American: true, Delta: true, Emirates: true,
      Frontier: true, JetBlue: true, QatarAirways: true, United: true,
    },
  });
  const [timeFilter, setTimeFilter] = useState({
    departure: [0, 24],
    arrival: [0, 24],
  });
  const [connectingAirports, setConnectingAirports] = useState([]);
  const handleAirportSelect = (airportId) => {
    setConnectingAirports((prevAirports) => {
      if (prevAirports.includes(airportId)) {
        // Remove airport if already selected
        return prevAirports.filter((id) => id !== airportId);
      } else {
        // Add airport to the list
        return [...prevAirports, airportId];
      }
    });
  };
  const [layoverDuration, setLayoverDuration] = useState([0, 24]);
  const [totalDuration, setTotalDuration] = useState([0, 24])
  const [openFilter, setOpenFilter] = useState(null);
  const popoverRef = useRef(null);
  const filterButtonRefs = useRef({});

  const handleFilterClick = useCallback((filterName) => {
    setOpenFilter(prev => prev === filterName ? null : filterName);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) &&
        !Object.values(filterButtonRefs.current).some(ref => ref.contains(event.target))) {
      setOpenFilter(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const renderFilterContent = () => {
    switch (openFilter) {
      case 'Price':
        return <PriceFilter price={priceFilter} setPrice={setPriceFilter} />;
      case 'Stops':
        return <StopsFilter stops={stopsFilter} setStops={setStopsFilter} />;
      case 'Airlines':
        return <AirlinesFilter airlines={airlinesFilter} setAirlines={setAirlinesFilter} />;
      case 'Times':
        return <TimesFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />;
      case 'Connecting airports':
        return (
            <div>
                <LayoverDurationFilter duration={layoverDuration} setDuration={setLayoverDuration} />
                <ConnectingAirportsFilter airports={airportsData} onAirportSelect={handleAirportSelect} />
            </div>);
      case 'Duration':
        return <TotalDurationFilter duration={totalDuration} setDuration={setTotalDuration} />;
      default:
        return null;
    }
  };

  const getPopoverPosition = () => {
    if (openFilter && filterButtonRefs.current[openFilter]) {
      const rect = filterButtonRefs.current[openFilter].getBoundingClientRect();
      const isMobile = window.innerWidth <= 600; // Adjust this breakpoint as needed
  
      if (isMobile) {
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxHeight: '80vh',
          position: 'fixed',
        };
      } else {
        return {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
        };
      }
    }
    return {};
  };

  return (
    <div className="filter-component">
      <div className="filter-chips">
        <Chip label="All filters" color="primary" variant="outlined" />
        {['Stops', 'Airlines', 'Price', 'Times', 'Connecting airports', 'Duration'].map((filter) => (
          <button
            key={filter}
            ref={el => filterButtonRefs.current[filter] = el}
            className={`filter-chip ${openFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {openFilter && (
        <div 
          ref={popoverRef} 
          className="custom-popover"
          style={getPopoverPosition()}
        >
          <div className="popover-header">
            <h4>{openFilter}</h4>
            <button onClick={() => setOpenFilter(null)}>X</button>
          </div>
          <div className="popover-content">
            {renderFilterContent()}
          </div>
        </div>
      )}
    </div>
  );
};

const PriceFilter = React.memo(({ price, setPrice }) => {
  return (
    <div className="price-filter">
      <p>Up to ${price}</p>
      <input
        type="range"
        min="0"
        max="2200"
        value={price}
        step={25}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
    </div>
  );
});

const StopsFilter = React.memo(({ stops, setStops }) => {
  return (
    <div className="stops-filter">
      {['any', 'nonstop', '1stop', '2stops'].map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={stops === option}
            onChange={(e) => setStops(e.target.value)}
          />
          {option === 'any' ? 'Any number of stops' : 
           option === 'nonstop' ? 'Nonstop only' :
           option === '1stop' ? '1 stop or fewer' : '2 stops or fewer'}
        </label>
      ))}
    </div>
  );
});

const AirlinesFilter = React.memo(({ airlines, setAirlines }) => {
  const handleChange = useCallback((category, item) => {
    setAirlines(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item],
      },
    }));
  }, [setAirlines]);

  return (
    <div className="airlines-filter">
      {Object.keys(airlines.airlines).map((airline) => (
        <label key={airline}>
          <input
            type="checkbox"
            checked={airlines.airlines[airline]}
            onChange={() => handleChange('airlines', airline)}
          />
          {airline}
        </label>
      ))}
    </div>
  );
});

const TimesFilter = React.memo(({ timeFilter, setTimeFilter }) => {
  const handleDepartureChange = (event, newValue) => {
    setTimeFilter(prev => ({ ...prev, departure: newValue }));
  };

  const handleArrivalChange = (event, newValue) => {
    setTimeFilter(prev => ({ ...prev, arrival: newValue }));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = (time - hours) * 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? '00' : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
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
            step={1}
            sx={{
                '& .MuiSlider-thumb': {
                width: 12, // Adjust the width of the slider thumb
                height: 12, // Adjust the height of the slider thumb
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
            step={1}
            sx={{
                '& .MuiSlider-thumb': {
                width: 12, // Adjust the width of the slider thumb
                height: 12, // Adjust the height of the slider thumb
                },
            }}
        />
      </div>
    </div>
    );
  });

  const ConnectingAirportsFilter = React.memo(({ airports, onAirportSelect }) => {
    // Assuming airports is an array of airport objects with id and name
  
    return (
      <div className="connecting-airports-filter">
        <p>Connecting Airports</p>
        {/* List of airports with checkboxes */}
        {airports.map((airport) => (
          <label key={airport.id}>
            <input type="checkbox" 
              checked={airport.checked}
              onChange={() => onAirportSelect(airport.id)} />
            {airport.name}
          </label>
        ))}
      </div>
    );
  });

  const LayoverDurationFilter = React.memo(({ duration, setDuration }) => {
    const handleDurationChange = (event, newValue) => {
      setDuration(newValue);
    };
  
    const formatDuration = (duration) => {
      const hours = Math.floor(duration);
      const minutes = (duration - hours) * 60;
      return `${hours}h ${minutes === 0 ? '' : `${minutes}m`}`;
    };
  
    return (
      <div className="layover-duration-filter">
        <p>Layover Duration</p>
        <div className="time-slider-layover">
          <div className="time-slider-header">
            <span>{formatDuration(duration[0])} - {formatDuration(duration[1])}</span>
          </div>
          <Slider
            value={duration}
            onChange={handleDurationChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatDuration}
            min={0}
            max={24}
            step={0.5}
            sx={{
              '& .MuiSlider-thumb': {
                width: 12, // Adjust the width of the slider thumb
                height: 12, // Adjust the height of the slider thumb
              },
            }}
          />
          <div className="time-slider-header">
            <span></span>
          </div>
        </div>
      </div>
    );
  });

  const TotalDurationFilter = React.memo(({ duration, setDuration }) => {
    const handleDurationChange = (event, newValue) => {
      setDuration(newValue);
    };
  
    const formatDuration = (duration) => {
      const hours = Math.floor(duration);
      const minutes = (duration - hours) * 60;
      return `${hours}h ${minutes === 0 ? '' : `${minutes}m`}`;
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
            max={24}
            step={0.5}
            sx={{
              '& .MuiSlider-thumb': {
                width: 12, // Adjust the width of the slider thumb
                height: 12, // Adjust the height of the slider thumb
              },
            }}
          />
          <div className="time-slider-header">
            <span></span>
          </div>
        </div>
      </div>
    );
  });

export default FilterComponent;
