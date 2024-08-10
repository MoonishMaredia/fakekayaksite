import React, { useState, useEffect, useMemo } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import TripOptionsBar from '../components/TripOptionsBar';
import FlightSearchBar from '../components/FlightSearchBar';
import FilterComponent from '../components/Filters';
import FlightCard from '../components/FlightCard';
import SortTitleBar from '../components/SortTitleBar';
import SelectedFlightPill from '../components/SelectedFlightPill';
import HeaderLayout from '../components/HeaderLayout';
import { useInput } from '../components/InputContext.js';
import { useResults } from '../components/ResultsContext';
import { useNavigate } from 'react-router-dom';


const seatScalar = {
  Economy: 1,
  Business: 3,
};

// Carry-on fees data
const carryOnFees = {
  Spirit: [50],
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
  Spirit: [55, 80, 90],
};

const getCarryFees = (airline, numBags) => {
  return carryOnFees[airline]?.[0] * numBags || 0;
};

const getCheckedFees = (airline, numBags) => {
  return checkedFees[airline]?.slice(0, numBags).reduce((a, b) => a + b, 0) || 0;
};

const FlightResultsPage = () => {
  const { searchInputs } = useInput({});
  const { results, setResults } = useResults({});
  const navigate = useNavigate();
  const [displayedFlights, setDisplayedFlights] = useState(results['data']);
  const [sortMethod, setSortMethod] = useState("Lowest Total Price");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReturnFlightPage, setIsReturnFlightPage] = useState(false)
  const [departFlight, setDepartFlight] = useState({})
  const [returnFlight, setReturnFlight] = useState({})
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // console.log(departFlight)

  function handleFlightSelection(flightId, airline, airlineLogoUrl) {
    if(!isReturnFlightPage) {
      setDepartFlight(
        {flightId,
          airline,
          airlineLogoUrl
        })
      if(searchInputs.trip_type==="Round-trip") {
        setIsReturnFlightPage(true)
      } else {
        navigate('/confirmation')
      }
      
    } else {
      setReturnFlight(
        {flightId,
          airline,
          airlineLogoUrl
        })
      navigate('/confirmation')
    }
  }

  useEffect(() => {

    if(!isReturnFlightPage)  {

        const flightArray = results.flightsTo.map(flight => {
        const adjTripCost = flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type];
        const bagFees = getCarryFees(flight.airline, flight.num_carryOn) * searchInputs.num_passengers;
        const checkedFees = getCheckedFees(flight.airline, searchInputs.num_checked) * searchInputs.num_passengers;
          
          return {
            ...flight,
            adjTripCost: adjTripCost, // Assign directly
            bagFees: bagFees, // Assign directly
            checkedFees: checkedFees, // Assign directly
            totalFlightCost: adjTripCost + bagFees + checkedFees // Calculate total cost
          };
        });
    
        setResults(prev=>({...prev, 'flightsTo':flightArray}))
        setDisplayedFlights(flightArray)
    }

    else {
        const flightArray = results.flightsReturn.map(flight => {
        const adjTripCost = flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type];
        const bagFees = getCarryFees(flight.airline, flight.num_carryOn) * searchInputs.num_passengers;
        const checkedFees = getCheckedFees(flight.airline, searchInputs.num_checked) * searchInputs.num_passengers;
          
          return {
            ...flight,
            adjTripCost: adjTripCost, // Assign directly
            bagFees: bagFees, // Assign directly
            checkedFees: checkedFees, // Assign directly
            totalFlightCost: adjTripCost + bagFees + checkedFees // Calculate total cost
          };
        });
    
        setResults(prev=>({...prev, 'flightsReturn':flightArray}))
        setDisplayedFlights(flightArray)
    }


  }, []);

  useEffect(() => {

    if(!isReturnFlightPage) {
        const flightArray = results.flightsTo.map(flight => {
        const adjTripCost = flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type];
        const bagFees = getCarryFees(flight.airline, flight.num_carryOn) * searchInputs.num_passengers;
        const checkedFees = getCheckedFees(flight.airline, searchInputs.num_checked) * searchInputs.num_passengers;
          
          return {
            ...flight,
            adjTripCost: adjTripCost, // Assign directly
            bagFees: bagFees, // Assign directly
            checkedFees: checkedFees, // Assign directly
            totalFlightCost: adjTripCost + bagFees + checkedFees // Calculate total cost
          };
        });
        
        setResults(prev=>({...prev, 'flightsTo':flightArray}))
        setDisplayedFlights(sortFlights(flightArray, sortMethod))

    } else {
        const flightArray = results.flightsReturn.map(flight => {
        const adjTripCost = flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type];
        const bagFees = getCarryFees(flight.airline, flight.num_carryOn) * searchInputs.num_passengers;
        const checkedFees = getCheckedFees(flight.airline, searchInputs.num_checked) * searchInputs.num_passengers;
          
          return {
            ...flight,
            adjTripCost: adjTripCost, // Assign directly
            bagFees: bagFees, // Assign directly
            checkedFees: checkedFees, // Assign directly
            totalFlightCost: adjTripCost + bagFees + checkedFees // Calculate total cost
          };
        });
        
        setResults(prev=>({...prev, 'flightsReturn':flightArray}))
        setDisplayedFlights(sortFlights(flightArray, sortMethod))
    }

  }, [searchInputs.num_passengers, searchInputs.seat_type, searchInputs.num_checked, searchInputs.num_carryOn, sortMethod]);

  useEffect(()=> {
    if(isReturnFlightPage) {
      setDisplayedFlights(sortFlights(results.flightsReturn, sortMethod))
    } else {
      setDisplayedFlights(sortFlights(results.flightsTo, sortMethod))
    }
  }, [isReturnFlightPage])

  return (
    <>
    {displayedFlights &&
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <HeaderLayout onChatOpen={handleChatOpen} />
      <Box
        sx={{
          p: 2,
          width: isMobile ? '90vw' : '100%',
          maxWidth: '1400px',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* <button onClick={()=>setIsReturnFlightPage(prev=>!prev)}>Click ME</button> */}
        <TripOptionsBar isMobile={isMobile} />
        <FlightSearchBar isMobile={isMobile} />
        <FilterComponent displayedFlights={displayedFlights} setDisplayedFlights={setDisplayedFlights} />
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: isMobile ? '100%' : '82%', gap: 2 }}>
        {isReturnFlightPage &&
            <SelectedFlightPill
              departFlight={departFlight}/>
          }
          <SortTitleBar sortMethod={sortMethod} 
          setSortMethod={setSortMethod} 
          isMobile={isMobile} 
          displayedFlights={displayedFlights} 
          setDisplayedFlights={setDisplayedFlights}
          isReturnFlightPage={isReturnFlightPage}/>
          {displayedFlights.map((flight, index) => (
            <FlightCard 
            key={index} 
            isMobile={isMobile} 
            flightData={flight} 
            isReturnFlightPage={isReturnFlightPage}
            handleFlightSelection={handleFlightSelection}/>
          ))}
        </Box>
      </Box>
    </Box>
        }
    </>
  );
};


function sortFlights(flights, sortBy) {

  function extractTime(dateTime) {
    const [date, time] = dateTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Convert time to total minutes since midnight
  }
  
  return flights.sort((a, b) => {
    switch (sortBy) {
      case 'Lowest Total Price':
        return a.totalFlightCost - b.totalFlightCost;
      
      case 'Shortest Duration':
        return a.total_duration - b.total_duration;
      
      case 'Earliest Takeoff Time':
        return extractTime(a.start_time) - extractTime(b.start_time);
      
      case 'Earliest Arrival Time':
        return extractTime(a.end_time) - extractTime(b.end_time);
      
      case 'Latest Takeoff Time':
        return extractTime(b.start_time) - extractTime(a.start_time);
      
      case 'Latest Arrival Time':
        return extractTime(b.end_time) - extractTime(a.end_time);
      
      default:
        return 0; // No sorting
    }
  });
}


export default FlightResultsPage;
