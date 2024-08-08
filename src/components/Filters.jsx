import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Chip } from '@mui/material';
import '../FilterComponent.css'; // We'll create this CSS file for styling
import { useResults } from './ResultsContext';
import PriceFilter from './filters/PriceFilter';
import StopsFilter from './filters/StopsFilter';
import AirlinesFilter from './filters/AirlinesFilter';
import TimesFilter from './filters/TimesFilter';
import ConnectingAirportsFilter from './filters/ConnectingAirportsFilter';
import LayoverDurationFilter from './filters/LayoverDurationFilter';
import TotalDurationFilter from './filters/TotalDurationFilter';
import initializeFilters from './initializeFilters';

const FilterComponent = ({displayedFlights, setDisplayedFlights}) => {

  const {results, setResults} = useResults({});
  // const [filterOptions, setFilterOptions] = useState(null);

  const filterOptions = useMemo(() => {
    if (results.data) {
      return initializeFilters(results.data);
    }
    return null;
  }, [results.data]);


  useEffect(() => {
    if (filterOptions) {
      setAirlinesFilter(filterOptions.airlinesFilterOptions);
      setConnectingAirports(filterOptions.connectingAirportsFilterOptions);
      setPriceFilter(filterOptions.maxPrice);
      setLayoverDuration([0, filterOptions.maxLayoverDuration]);
      setTotalDuration([0, filterOptions.maxDuration]);
    }
  }, [filterOptions]);

  const handleAirportSelect = (airportId) => {
    setConnectingAirports((prevAirports) => {
      return prevAirports.map(airport=> {
        if(airport.id===airportId) {
          airport.checked=!airport.checked
        }
        return airport
      })
    });
  };

  const [airlinesFilter, setAirlinesFilter] = useState({});
  const [connectingAirports, setConnectingAirports] = useState([]);
  const [priceFilter, setPriceFilter] = useState(0);
  const [stopsFilter, setStopsFilter] = useState(100);
  const [timeFilter, setTimeFilter] = useState({ departure: [0, 24], arrival: [0, 24] });
  const [layoverDuration, setLayoverDuration] = useState([0, 0]);
  const [totalDuration, setTotalDuration] = useState([0, 0]);

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
        return <PriceFilter price={priceFilter} setPrice={setPriceFilter} maxPrice={filterOptions.maxPrice} />;
      case 'Stops':
        return <StopsFilter stops={stopsFilter} setStops={setStopsFilter} />;
      case 'Airlines':
        return <AirlinesFilter 
        airlines={airlinesFilter} 
        setAirlines={setAirlinesFilter} />;
      case 'Times':
        return <TimesFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />;
      case 'Connecting airports':
        return (
            <div>
                <LayoverDurationFilter 
                duration={layoverDuration} 
                setDuration={setLayoverDuration} 
                maxLayoverDuration={filterOptions.maxLayoverDuration}/>
                <ConnectingAirportsFilter airports={connectingAirports} onAirportSelect={handleAirportSelect} />
            </div>);
      case 'Duration':
        return <TotalDurationFilter 
          duration={totalDuration} 
          setDuration={setTotalDuration}
          maxDuration={filterOptions.maxDuration} />;
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

    if (!results.data) return;

    let newFlights = results['data']

    const areAllAirlinesSelected = Object.values(airlinesFilter).every(selected => selected);
    if (!areAllAirlinesSelected) {
      const selectedAirlines = Object.keys(airlinesFilter).filter(airline => airlinesFilter[airline]);
      newFlights = newFlights.filter(flight => selectedAirlines.includes(flight.airline));
    }

    if (stopsFilter !== 100) {
      newFlights = newFlights.filter(flight => flight.num_stops <= stopsFilter);
    }

    if (priceFilter !== filterOptions.maxPrice) {
      newFlights = newFlights.filter(flight => flight.trip_cost <= priceFilter);
    }

    if (timeFilter['departure'][0] !== 0 || timeFilter['departure'][1] !== 24) {
      const [lowerBound, upperBound] = timeFilter['departure'];
      newFlights = newFlights.filter(flight => flight.start_time_hours >= lowerBound && flight.start_time_hours <= upperBound);
    }

    if (timeFilter['arrival'][0] !== 0 || timeFilter['arrival'][1] !== 24) {
      const [lowerBound, upperBound] = timeFilter['arrival'];
      newFlights = newFlights.filter(flight => flight.end_time_hours >= lowerBound && flight.end_time_hours <= upperBound);
    }

    if (totalDuration[0] !== 0 || totalDuration[1] !== filterOptions.maxDuration) {
      const [lowerBound, upperBound] = totalDuration;
      newFlights = newFlights.filter(flight => {
        const durationInHours = flight.total_duration / 60;
        return durationInHours >= lowerBound && durationInHours <= upperBound;
      });
    }
    
    if (layoverDuration[0] !== 0 || layoverDuration[1] !== filterOptions.maxLayoverDuration) {
      const [lowerBound, upperBound] = layoverDuration;
      newFlights = newFlights.filter(flight => 
        flight.layover === null || flight.layover.every(layover => {
          const durationInHours = layover.duration / 60;
          return durationInHours >= lowerBound && durationInHours <= upperBound;
        })
      );
    }

    const areAllConnectionsSelected = connectingAirports.every(airport => airport.checked);
    if (!areAllConnectionsSelected) {
      const unselectedConnections = connectingAirports
        .filter(airport => !airport.checked)
        .map(airport => airport.id);
      newFlights = newFlights.filter(flight => 
        flight.layover === null || !flight.layover.some(layover => unselectedConnections.includes(layover.id))
      );
    }

    setDisplayedFlights(newFlights)

  }, [airlinesFilter, stopsFilter, priceFilter, timeFilter, totalDuration, connectingAirports, layoverDuration])  

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


export default FilterComponent;
