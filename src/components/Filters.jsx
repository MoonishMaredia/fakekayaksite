import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Chip } from '@mui/material';
import { Slider } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import {FlightLand} from '@mui/icons-material';
import '../FilterComponent.css'; // We'll create this CSS file for styling
import { useResults } from './ResultsContext';
import {airportCodes} from '../busyairportcodes.js'
import { flightDataArray } from '../utils/testResultsData';

const FilterComponent = ({displayedFlights, setDisplayedFlights}) => {

  const {results, setResults} = useResults({});

  const allAirlines = useMemo(() => {
    return Array.from(new Set(results['data'].map(flight => flight.airline)));
  }, [results['data']]);

  const airlinesFilterOptions =  useMemo(() => {
    return allAirlines.reduce((acc, airline) => {
    acc[airline] = true;  
    return acc;
  }, {})}, [results['data']]);

  const [airlinesFilter, setAirlinesFilter] = useState({"airlines": airlinesFilterOptions});
  const [isAirlineFilterUpdated, setIsAirlineFilterUpdated] = useState(false)

  const allConnectingAirports = useMemo(() => {
    return Array.from(new Set(
      results['data']
        .filter(flight => flight.layover !== null) // Filter out flights without layover
        .flatMap(flight => flight.layover.map(layover => layover.id))
    ));
  }, [results['data']]);

  const connectingAirportsFilterOptions =  useMemo(() => {
    return allConnectingAirports.reduce((acc, id) => {
      const add = {
        'id': id,
        'name': airportCodes[id].name,
        'checked':true
      }
      acc.push(add)
      return acc
  }, [])}, [results['data']]);

  const [connectingAirports, setConnectingAirports] = useState();
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

  const maxPrice = useMemo(() => {
    return results['data'].reduce((acc,curr) => {
      if (curr.trip_cost > acc) {
        acc = curr.trip_cost}
      return acc
    }, [0])}, [results['data']])

  const [priceFilter, setPriceFilter] = useState(maxPrice);
  const [stopsFilter, setStopsFilter] = useState(100);
  const [timeFilter, setTimeFilter] = useState({
    departure: [0, 24],
    arrival: [0, 24],
  });

  const maxLayoverDuration = useMemo(() => {
    return results['data']
        .filter(flight => flight.layover !== null) // Filter out flights without layover
        .flatMap(flight => flight.layover.map(layover => layover.duration))
        .reduce((acc, curr) => curr/60 > acc ? Math.ceil(curr/60) : acc, [0]);
  }, [results['data']]);

  const [layoverDuration, setLayoverDuration] = useState([0, maxLayoverDuration]);

  const maxDuration = useMemo(() => {
    return displayedFlights.reduce((acc,curr) => {
      if (curr.total_duration / 60 > acc) {
        acc = curr.total_duration / 60
      }
      return Math.ceil(acc)
    }, [0])}, [results['data']])

  const [totalDuration, setTotalDuration] = useState([0, maxDuration]);
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
        return <PriceFilter price={priceFilter} setPrice={setPriceFilter} maxPrice={maxPrice} />;
      case 'Stops':
        return <StopsFilter stops={stopsFilter} setStops={setStopsFilter} />;
      case 'Airlines':
        return <AirlinesFilter 
        airlines={airlinesFilter} 
        setAirlines={setAirlinesFilter} 
        setIsAirlineFilterUpdated={setIsAirlineFilterUpdated}/>;
      case 'Times':
        return <TimesFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />;
      case 'Connecting airports':
        return (
            <div>
                <LayoverDurationFilter 
                duration={layoverDuration} 
                setDuration={setLayoverDuration} 
                maxLayoverDuration={maxLayoverDuration}/>
                <ConnectingAirportsFilter airports={connectingAirportsFilterOptions} onAirportSelect={handleAirportSelect} />
            </div>);
      case 'Duration':
        return <TotalDurationFilter 
          duration={totalDuration} 
          setDuration={setTotalDuration}
          maxDuration={maxDuration} />;
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

  useEffect(()=> {

    let newFlights = results['data']

    const areAllAirlinesSelected = Object.values(airlinesFilter['airlines']).every((selected) => selected);
    if(!areAllAirlinesSelected) {
      const selectedAirlines = Object.keys(airlinesFilter['airlines']).filter((airline) => airlinesFilter['airlines'][airline])
      newFlights = newFlights.filter(flight=>selectedAirlines.includes(flight.airline))
    }

    if(stopsFilter!==100) {
      newFlights = newFlights.filter(flight=>flight.num_stops <= stopsFilter)
    }

    if(priceFilter!==maxPrice) {
      newFlights = newFlights.filter(flight=> flight.trip_cost <= priceFilter)
    }

    if(timeFilter['departure'][0] !==0 || timeFilter['departure'][1]!==24) {
      const lowerBound = timeFilter['departure'][0]
      const upperBound = timeFilter['departure'][1]
      newFlights = newFlights.filter(flight => ((flight.start_time_hours >= lowerBound) && (flight.start_time_hours<=upperBound)))
    }

    if(timeFilter['arrival'][0] !==0 || timeFilter['arrival'][1]!==24) {
      const lowerBound = timeFilter['arrival'][0]
      const upperBound = timeFilter['arrival'][1]
      newFlights = newFlights.filter(flight => (flight.end_time_hours >= lowerBound) && (flight.end_time_hours<=upperBound))
    }

    if(totalDuration[0]!==0 || totalDuration[1]!==maxDuration) {
      const lowerBound = totalDuration[0]
      const upperBound = totalDuration[1]
      newFlights = newFlights.filter(flight=>(flight.total_duration/60 >= lowerBound) && (flight.total_duration/60 <=upperBound))
    }

    if(layoverDuration[0]!==0 || layoverDuration[1]!==maxLayoverDuration) {
      const lowerBound = layoverDuration[0]
      const upperBound = layoverDuration[1]
      newFlights = newFlights.filter(flight=> {
        if(flight.layover===null) {
          return true
        } else {
          const allMatch = flight.layover.every((layover=>((layover.duration/60 >= lowerBound ) && (layover.duration/60 <= upperBound))))
          return allMatch
        }
      })
    }

    setDisplayedFlights(newFlights)

  }, [airlinesFilter, stopsFilter, priceFilter, timeFilter, totalDuration, layoverDuration])  

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

const PriceFilter = React.memo(({ price, setPrice, maxPrice }) => {
  return (
    <div className="price-filter">
      <p>Up to ${price}</p>
      <input
        type="range"
        min="0"
        max={maxPrice}
        value={price}
        step={10}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
    </div>
  );
});

const StopsFilter = React.memo(({ stops, setStops }) => {
  return (
    <div className="stops-filter">
      {[100, 0, 1, 2].map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={stops === option}
            onChange={(e) => setStops(Number(e.target.value))}
          />
          {option === 100 ? 'Any number of stops' :
           option === 0 ? 'Nonstop only' :
           option === 1 ? '1 stop or fewer' : '2 stops or fewer'}
        </label>
      ))}
    </div>
  );
});

const AirlinesFilter = React.memo(({ airlines, setAirlines, setIsAirlineFilterUpdated }) => {
  const handleChange = useCallback((category, item) => {
    setAirlines(prev => ({
      [category]: {
        ...prev[category],
        [item]: !prev[category][item],
      },
    }))

    setIsAirlineFilterUpdated(true);
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
            {airport.name} ({airport.id})
          </label>
        ))}
      </div>
    );
  });

  const LayoverDurationFilter = React.memo(({ duration, setDuration, maxLayoverDuration }) => {
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
            max={maxLayoverDuration}
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

  const TotalDurationFilter = React.memo(({ duration, setDuration, maxDuration }) => {
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
            max={maxDuration}
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
