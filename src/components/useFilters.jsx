// useFilters.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useResults } from './ResultsContext';
import { airportCodes } from '../busyairportcodes.js';

export const useFilters = () => {
  const { results } = useResults();

  const [filters, setFilters] = useState({
    airlines: {},
    stops: 100,
    price: 0,
    time: {
      departure: [0, 24],
      arrival: [0, 24],
    },
    layoverDuration: [0, 0],
    totalDuration: [0, 0],
  });

  const [connectingAirports, setConnectingAirports] = useState([]);

  const allAirlines = useMemo(() => {
    return Array.from(new Set(results.data.map(flight => flight.airline)));
  }, [results.data]);

  const maxPrice = useMemo(() => {
    return Math.max(...results.data.map(flight => flight.trip_cost));
  }, [results.data]);

  const maxLayoverDuration = useMemo(() => {
    return Math.ceil(Math.max(...results.data
      .filter(flight => flight.layover !== null)
      .flatMap(flight => flight.layover.map(layover => layover.duration / 60))
    ));
  }, [results.data]);

  const maxDuration = useMemo(() => {
    return Math.ceil(Math.max(...results.data.map(flight => flight.total_duration / 60)));
  }, [results.data]);

  useEffect(() => {
    const airlinesOptions = allAirlines.reduce((acc, airline) => {
      acc[airline] = true;
      return acc;
    }, {});

    const connectingAirportsOptions = Array.from(new Set(
      results.data
        .filter(flight => flight.layover !== null)
        .flatMap(flight => flight.layover.map(layover => layover.id))
    )).map(id => ({
      id,
      name: airportCodes[id].name,
      checked: true
    }));

    setFilters(prev => ({
      ...prev,
      airlines: airlinesOptions,
      price: maxPrice,
      layoverDuration: [0, maxLayoverDuration],
      totalDuration: [0, maxDuration],
    }));

    setConnectingAirports(connectingAirportsOptions);
  }, [results.data, allAirlines, maxPrice, maxLayoverDuration, maxDuration]);

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }, []);

  const handleAirportSelect = useCallback((airportId) => {
    setConnectingAirports(prev => prev.map(airport => 
      airport.id === airportId ? { ...airport, checked: !airport.checked } : airport
    ));
  }, []);

  const applyFilters = useCallback((flights) => {
    return flights.filter(flight => {
      return (
        filters.airlines[flight.airline] &&
        flight.num_stops <= filters.stops &&
        flight.trip_cost <= filters.price &&
        flight.start_time_hours >= filters.time.departure[0] &&
        flight.start_time_hours <= filters.time.departure[1] &&
        flight.end_time_hours >= filters.time.arrival[0] &&
        flight.end_time_hours <= filters.time.arrival[1] &&
        flight.total_duration / 60 >= filters.totalDuration[0] &&
        flight.total_duration / 60 <= filters.totalDuration[1] &&
        (flight.layover === null || flight.layover.every(layover => 
          layover.duration / 60 >= filters.layoverDuration[0] &&
          layover.duration / 60 <= filters.layoverDuration[1] &&
          connectingAirports.find(airport => airport.id === layover.id)?.checked
        ))
      );
    });
  }, [filters, connectingAirports]);

  return {
    filters,
    updateFilter,
    maxPrice,
    maxLayoverDuration,
    maxDuration,
    connectingAirports,
    handleAirportSelect,
    applyFilters
  };
};