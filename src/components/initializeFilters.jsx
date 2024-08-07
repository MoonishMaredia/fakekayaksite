import { airportCodes } from '../busyairportcodes.js';

export const initializeFilters = (results) => {
  const allAirlines = Array.from(new Set(results.map(flight => flight.airline)));

  const airlinesFilterOptions = allAirlines.reduce((acc, airline) => {
    acc[airline] = true;
    return acc;
  }, {});

  const allConnectingAirports = Array.from(new Set(
    results
      .filter(flight => flight.layover !== null)
      .flatMap(flight => flight.layover.map(layover => layover.id))
  ));

  const connectingAirportsFilterOptions = allConnectingAirports.reduce((acc, id) => {
    const add = {
      'id': id,
      'name': airportCodes[id].name,
      'checked': true
    };
    acc.push(add);
    return acc;
  }, []);

  const maxPrice = results.reduce((acc, curr) => {
    return curr.trip_cost > acc ? curr.trip_cost : acc;
  }, 0);

  const maxLayoverDuration = results
    .filter(flight => flight.layover !== null)
    .flatMap(flight => flight.layover.map(layover => layover.duration))
    .reduce((acc, curr) => curr / 60 > acc ? Math.ceil(curr / 60) : acc, 0);

  const maxDuration = results.reduce((acc, curr) => {
    const duration = curr.total_duration / 60;
    return duration > acc ? Math.ceil(duration) : acc;
  }, 0);

  return {
    allAirlines,
    airlinesFilterOptions,
    allConnectingAirports,
    connectingAirportsFilterOptions,
    maxPrice,
    maxLayoverDuration,
    maxDuration
  };
};

export default initializeFilters;
