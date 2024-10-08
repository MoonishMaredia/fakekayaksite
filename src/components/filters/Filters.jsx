import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Chip } from '@mui/material';
import './FilterComponent.css'; // We'll create this CSS file for styling
import { useResults } from '../ResultsContext';
import { useInput } from '../InputContext';
import PriceFilter from './PriceFilter';
import StopsFilter from './StopsFilter';
import AirlinesFilter from './AirlinesFilter';
import TimesFilter from './TimesFilter';
import LayoverDurationFilter from './LayoverDurationFilter';
import TotalDurationFilter from './TotalDurationFilter';

const FilterComponent = ({
    displayedFlights, 
    setDisplayedFlights,
    isReturnFlightPage,
    airlinesFilter,
    setAirlinesFilter,
    priceFilter,
    setPriceFilter,
    stopsFilter,
    setStopsFilter,
    timeFilter,
    setTimeFilter,
    layoverDuration,
    setLayoverDuration,
    totalDuration,
    setTotalDuration,
    filterOptions,
    isStopsFilter,
    setIsStopsFilter,
    isAirlinesFilter,
    setIsAirlinesFilter,
    isPriceFilter,
    setIsPriceFilter,
    isTimeFilter,
    setIsTimeFilter,
    isConnectingAirportsFilter,
    setIsConnectingAirportsFilter,
    isDurationFilter,
    setIsDurationFilter}) => {

  const {results, setResults} = useResults({});
  const {searchInputs, setSearchInputs} = useInput({});


  function getFilterName(filterName) {
    switch(filterName) {
      case "Stops":
        return isStopsFilter ? 'filter-chip filter-active' : 'filter-chip'
      case "Airlines":
        return isAirlinesFilter ? 'filter-chip filter-active' : 'filter-chip'
      case "Price":
        return isPriceFilter ? 'filter-chip filter-active' : 'filter-chip'
      case "Times":
        return isTimeFilter ? 'filter-chip filter-active' : 'filter-chip'
      case "Layover":
        return isConnectingAirportsFilter ? 'filter-chip filter-active' : 'filter-chip'
      case "Total Duration":
        return isDurationFilter ? 'filter-chip filter-active' : 'filter-chip'
      default:
        return 'filter-chip'
    }
  }

  useEffect(() => {
    if (filterOptions) {
      const {
        airlinesFilterOptions,
        maxPrice,
        maxLayoverDuration,
        maxDuration,
      } = filterOptions;
  
      if (stopsFilter !== undefined) setStopsFilter(isStopsFilter ? stopsFilter : 100);
      if (airlinesFilterOptions !== undefined) setAirlinesFilter(isAirlinesFilter ? airlinesFilter : airlinesFilterOptions);
      if (maxPrice !== undefined) setPriceFilter(isPriceFilter ? priceFilter : maxPrice);
      if (maxLayoverDuration !== undefined) setLayoverDuration(isConnectingAirportsFilter ? layoverDuration : [0, maxLayoverDuration]);
      if (maxDuration !== undefined) setTotalDuration(isDurationFilter ? totalDuration : [0, maxDuration]);
      if (timeFilter !== undefined) setTimeFilter(isTimeFilter ? timeFilter : { 'departure': [0, 24], 'arrival': [0, 24] });
    }
  }, [filterOptions, isStopsFilter, isAirlinesFilter, isPriceFilter, isConnectingAirportsFilter, isDurationFilter, isTimeFilter]);

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
      case 'Layover':
        return (
          <div>
              <LayoverDurationFilter 
              duration={layoverDuration} 
              setDuration={setLayoverDuration} 
              maxLayoverDuration={filterOptions.maxLayoverDuration}/>
          </div>
          );
      case 'Total Duration':
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

    // if (!results.flightsTo) return;

    let newFlights = null

    if(isReturnFlightPage) {
      newFlights = results['flightsReturn']
    } else {
      newFlights = results['flightsTo']
    }

    const areAllAirlinesSelected = Object.values(airlinesFilter).every(selected => selected);
    if (!areAllAirlinesSelected) {
      const selectedAirlines = Object.keys(airlinesFilter).filter(airline => airlinesFilter[airline]);
      newFlights = newFlights.filter(flight => selectedAirlines.includes(flight.airline));
      setIsAirlinesFilter(true)
    } else {
      setIsAirlinesFilter(false)
    }

    if (stopsFilter !== 100) {
      newFlights = newFlights.filter(flight => flight.num_stops <= stopsFilter);
      setIsStopsFilter(true)
    } else {
      setIsStopsFilter(false)
    }

    if (priceFilter < filterOptions.maxPrice) {
      newFlights = newFlights.filter(flight => flight.totalFlightCost <= priceFilter);
      setIsPriceFilter(true)
    } else {
      setIsPriceFilter(false)
    }

    let isTimeDepartureFilter = false
    if (timeFilter['departure'][0] !== 0 || timeFilter['departure'][1] !== 24) {
      const [lowerBound, upperBound] = timeFilter['departure'];
      newFlights = newFlights.filter(flight => flight.start_time_hours >= lowerBound && flight.start_time_hours <= upperBound);
      isTimeDepartureFilter = true
    } 
    
    let isTimeArrivalFilter = false
    if (timeFilter['arrival'][0] !== 0 || timeFilter['arrival'][1] !== 24) {
      const [lowerBound, upperBound] = timeFilter['arrival'];
      newFlights = newFlights.filter(flight => flight.end_time_hours >= lowerBound && flight.end_time_hours <= upperBound);
      isTimeArrivalFilter = true
    }

    setIsTimeFilter(isTimeDepartureFilter || isTimeArrivalFilter)


    if (totalDuration[0] !== 0 || totalDuration[1] !== filterOptions.maxDuration) {
      const [lowerBound, upperBound] = totalDuration;
      newFlights = newFlights.filter(flight => {
        const durationInHours = flight.total_duration / 60;
        return durationInHours >= lowerBound && durationInHours <= upperBound;
      });
      setIsDurationFilter(true)
    } else {
      setIsDurationFilter(false)
    }
    
    if (layoverDuration[0] !== 0 || layoverDuration[1] !== filterOptions.maxLayoverDuration) {
      const [lowerBound, upperBound] = layoverDuration;
      newFlights = newFlights.filter(flight => 
        flight.layover === null || flight.layover.every(layover => {
          const durationInHours = layover.duration / 60;
          return durationInHours >= lowerBound && durationInHours <= upperBound;
        })
      );
      setIsConnectingAirportsFilter(true)
    } else {
      setIsConnectingAirportsFilter(false)
    }

    setDisplayedFlights(newFlights)

  }, [airlinesFilter, stopsFilter, priceFilter, timeFilter, totalDuration, layoverDuration, displayedFlights])  

  return (
    <div className="filter-component">
      <div className="filter-chips">
        <Chip label="All filters" color="primary" variant="outlined" />
        {['Stops', 'Airlines', 'Price', 'Times', 'Layover', 'Total Duration'].map((filter) => (
          <button
            key={filter}
            ref={el => filterButtonRefs.current[filter] = el}
            className={`${getFilterName(filter)} ${openFilter === filter ? 'active' : ''}`}
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
