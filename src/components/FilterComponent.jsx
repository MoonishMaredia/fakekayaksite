import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chip } from '@mui/material';
import '../FilterComponent.css';
import { useFilters } from './useFilters';
import { useResults } from './ResultsContext';
import PriceFilter from './filters/PriceFilter';
import StopsFilter from './filters/StopsFilter';
import AirlinesFilter from './filters/AirlinesFilter';
import TimesFilter from './filters/TimesFilter';
import ConnectingAirportsFilter from './filters/ConnectingAirportsFilter';
import LayoverDurationFilter from './filters/LayoverDurationFilter';
import TotalDurationFilter from './filters/TotalDurationFilter';

const FilterComponent = ({ displayedFlights, setDisplayedFlights }) => {
    const { results } = useResults();
    const {
      filters,
      updateFilter,
      maxPrice,
      maxLayoverDuration,
      maxDuration,
      connectingAirports,
      handleAirportSelect,
      applyFilters
    } = useFilters();

  const [openFilter, setOpenFilter] = useState(null);
  const popoverRef = useRef(null);
  const filterButtonRefs = useRef({});

  useEffect(() => {
    const filteredFlights = applyFilters(results.data);
    setDisplayedFlights(filteredFlights);
  }, [results.data, applyFilters, setDisplayedFlights]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const renderFilterContent = () => {
    switch (openFilter) {
      case 'Price':
        return <PriceFilter price={filters.price} setPrice={(value) => updateFilter('price', value)} maxPrice={maxPrice} />;
      case 'Stops':
        return <StopsFilter stops={filters.stops} setStops={(value) => updateFilter('stops', value)} />;
      case 'Airlines':
        return <AirlinesFilter airlines={filters.airlines} setAirlines={(value) => updateFilter('airlines', value)} />;
      case 'Times':
        return <TimesFilter timeFilter={filters.time} setTimeFilter={(value) => updateFilter('time', value)} />;
      case 'Connecting airports':
        return (
          <>
            <LayoverDurationFilter 
              duration={filters.layoverDuration} 
              setDuration={(value) => updateFilter('layoverDuration', value)} 
              maxLayoverDuration={maxLayoverDuration}
            />
            <ConnectingAirportsFilter airports={connectingAirports} onAirportSelect={handleAirportSelect} />
          </>
        );
      case 'Duration':
        return <TotalDurationFilter 
          duration={filters.totalDuration} 
          setDuration={(value) => updateFilter('totalDuration', value)}
          maxDuration={maxDuration}
        />;
      default:
        return null;
    }
  };

  const getPopoverPosition = () => {
    if (openFilter && filterButtonRefs.current[openFilter]) {
      const rect = filterButtonRefs.current[openFilter].getBoundingClientRect();
      const isMobile = window.innerWidth <= 600;
  
      return isMobile ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxHeight: '80vh',
        position: 'fixed',
      } : {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
      };
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

export default FilterComponent;