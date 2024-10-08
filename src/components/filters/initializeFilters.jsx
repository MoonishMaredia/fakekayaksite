import { airportCodes } from '../../busyairportcodes.js';

export const initializeFilters = (results, scalars, searchInputs) => {
  const allAirlines = Array.from(new Set(results.map(flight => flight.airline)));

  const airlinesFilterOptions = allAirlines.reduce((acc, airline) => {
    acc[airline] = true;
    return acc;
  }, {});

  // Carry-on fees data
  const seatScalar = {
    Economy: 1,
    Business: 3,
  };

    // Carry-on fees data
    const carryOnFees = {
      Spirit: [50]
    };
  
    // Checked fees data
    const checkedFees = {
      Alaska: [35, 45, 150],
      American: [35, 45, 150],
      Delta: [35, 45, 150],
      Frontier: [70, 90, 100],
      Hawaiian: [25, 40, 100],
      JetBlue: [40, 60, 125],
      Southwest: [0, 0, 125],
      Spirit: [55, 80, 90]
    };

    // Function to get carry-on fees
    const getCarryFees = (airline, numBags) => {
      if (carryOnFees.hasOwnProperty(airline)) {
          return carryOnFees[airline][0] * numBags;
      } else {
      return 0;
    }
  };
  
    // Function to get checked fees
    const getCheckedFees = (airline, numBags, roundTrip=false) => {
      if (checkedFees.hasOwnProperty(airline)) {
          return checkedFees[airline].slice(0, numBags).reduce((a, b) => a + b, 0);
        } else {
          return checkedFees['American'].slice(0, numBags).reduce((a, b) => a + b, 0);
        }
    } 

    const maxPrice = results.reduce((acc, curr, index) => {
    const checkedBagFees = getCheckedFees(curr.airline, searchInputs['num_checked'] * searchInputs['num_passengers']);
    const carryOnBagFees = getCarryFees(curr.airline, searchInputs['num_carryOn'] * searchInputs['num_passengers']);
    const tripCost = Math.ceil(curr.trip_cost * searchInputs['num_passengers'] * seatScalar[searchInputs.seat_type] * scalars[index]) + carryOnBagFees + checkedBagFees;
    return tripCost > acc ? tripCost : acc;
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
    airlinesFilterOptions,
    maxPrice,
    maxLayoverDuration,
    maxDuration
  };
};

export default initializeFilters;
