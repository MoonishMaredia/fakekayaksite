import React, { useState, useEffect, useMemo } from 'react';
import { Box, useMediaQuery, useTheme, CircularProgress, Typography } from '@mui/material';
import TripOptionsBar from '../components/resultsPage/TripOptionsBar';
import FlightSearchBar from '../components/resultsPage/FlightSearchBar';
import FilterComponent from '../components/filters/Filters.jsx';
import FlightCard from '../components/resultsPage/FlightCard';
import SortTitleBar from '../components/resultsPage/SortTitleBar';
import SelectedFlightPill from '../components/resultsPage/SelectedFlightPill';
import HeaderLayout from '../components/HeaderLayout';
import { useInput } from '../components/InputContext.js';
import { useResults } from '../components/ResultsContext.js';
import { useBooking } from '../components/BookingContext.js'
import { useNavigate } from 'react-router-dom';
import {getFlightScalars, getFlightResults} from '../utils/api.js'
import ChatModal from '../components/chat/ChatModalResults.jsx'
import moment from 'moment';
import initializeFilters from '../components/filters/initializeFilters';

// Scalar to apply for different seat types
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
  return checkedFees[airline]?.slice(0, numBags).reduce((a, b) => a + b, 0) || 50 * numBags;
};

const FlightResultsPage = () => {
  
  //import context variables
  const { searchInputs, setSearchInputs } = useInput({});
  const { results, setResults } = useResults({});
  const { bookingDetails, setBookingDetails } = useBooking({});
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [displayedFlights, setDisplayedFlights] = useState(results['data']);
  const [sortMethod, setSortMethod] = useState("Lowest Total Price");

  const [isReturnFlightPage, setIsReturnFlightPage] = useState(false)
  const [departFlight, setDepartFlight] = useState({})
  const [returnFlight, setReturnFlight] = useState({})

  //declare filters
  const [airlinesFilter, setAirlinesFilter] = useState({});
  const [priceFilter, setPriceFilter] = useState(0);
  const [stopsFilter, setStopsFilter] = useState(100);
  const [timeFilter, setTimeFilter] = useState({ 'departure': [0, 24], 'arrival': [0, 24] });
  const [layoverDuration, setLayoverDuration] = useState([0,0]);
  const [totalDuration, setTotalDuration] = useState([0, 0]);

  //state variable to track which  filters are active
  const [isStopsFilter, setIsStopsFilter] = useState(false)
  const [isAirlinesFilter, setIsAirlinesFilter] = useState(false)
  const [isPriceFilter, setIsPriceFilter] = useState(false)
  const [isTimeFilter, setIsTimeFilter] = useState(false)
  const [isConnectingAirportsFilter, setIsConnectingAirportsFilter] = useState(false)
  const [isDurationFilter, setIsDurationFilter] = useState(false)

  //variables to track / interact with chat module 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  //generate object to pass to backend to provide context for current flight search
  function getCompletedObject() {
    const objStr = {
      "trip_type": searchInputs.trip_type,
      "flying_from": searchInputs.flying_from,
      "flying_to": searchInputs.flying_to,
      "start_date": searchInputs.start_date,
      "return_date": searchInputs.return_date,
      "num_passengers": searchInputs.num_passengers,
      "seat_type":  searchInputs.seat_type,
      "num_carryOn": searchInputs.num_carryOn,
      "num_checked": searchInputs.num_checked
    };

    return objStr
  }

  //generate object to pass to backend to provide context for active filters and values
  function getFilterObject() {
    const objStr = {
    "stops": stopsFilter,
    "airlines": airlinesFilter,
    "price": priceFilter,
    "departureTime": timeFilter.departure,
    "arrivalTime": timeFilter.arrival,
    "layoverDuration":layoverDuration,
    "totalDuration":totalDuration
    }
    return objStr
  }

  //generate object to pass to backend to provide context on currently displayed flights
  function getDisplayedFlightsObject() {

    const objStr = JSON.stringify(displayedFlights.map(flight=>{
      const hours = Math.floor(flight.total_duration / 60)
      const minutes = flight.total_duration % 60
      const reducedObj = {
        "_id":flight._id,
        "totalFlightCost":flight.totalFlightCost,
        "airline":flight.airline,
        "start_time": flight.start_time,
        "end_time": flight.end_time,
        "num_stops": flight['num_stops']===0 ? "Nonstop" : `${flight['num_stops']} stop`,
        "duration": `${hours} hours ${minutes} min`,
      }
      return reducedObj
    }))

    return objStr
  }

  //initialize filter values based on results. Update if search inputs change
  const filterOptions = useMemo(() => {
    
    if (results.flightsTo && !isReturnFlightPage) {
      return initializeFilters(results.flightsTo, results.scalarsTo, searchInputs);
    } else if(results.flightsReturn && isReturnFlightPage) {
      return initializeFilters(results.flightsReturn, results.scalarsReturn, searchInputs);
    }
    return null;
  }, [searchInputs, isReturnFlightPage]);

  function handleSort(value) {
    setSortMethod(value)
    setDisplayedFlights(sortFlights(displayedFlights, value))
  }

  //handler to clear all filters if appropriate message is received from user
  async function resetFilters() {
    setIsStopsFilter(false)
    setAirlinesFilter(false)
    setIsPriceFilter(false)
    setIsTimeFilter(false)
    setIsConnectingAirportsFilter(false)
    setIsDurationFilter(false)
  }

  //handler to process single airport change request
  async function handleSingleAirportChange(takeOff, newAirport) {
    let resultsData = {}
    if(takeOff) {
      resultsData = await getFlightResults(newAirport, searchInputs.flying_to, 
        searchInputs.trip_type, searchInputs.start_date, searchInputs.return_date)
    } else {
      resultsData = await getFlightResults(searchInputs.flying_from, newAirport, 
        searchInputs.trip_type, searchInputs.start_date, searchInputs.return_date)
    }
    setResults(resultsData)
    setSearchInputs(prev => ({...prev, [takeOff ? 'flying_from' : 'flying_to']: newAirport}))
  }

  //handler to process multiple airport changes
  async function handleMultipleAirportChange(newOrigAirport, newDestAirport) {
    let resultsData = {}
      resultsData = await getFlightResults(newOrigAirport, newDestAirport, 
        searchInputs.trip_type, searchInputs.start_date, searchInputs.return_date)
    setResults(resultsData)
    setSearchInputs(prev=>({...prev, "flying_from":newOrigAirport, "flying_to":newDestAirport}))
  }

    // Function to format date to YYYY-MM-DD using moment
    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    function addDays(date, days) {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  
    async function handleStartDateChange(date, isString=false) {
      let dateStr = ""
      let newDate = null
      if(isString) {
        dateStr = date
        newDate = new Date(dateStr)
      } else {
        dateStr = formatDate(date)
        newDate = date
      }
      const newScalars = await getFlightScalars(dateStr, results.flightsTo.length)
      setResults(prev=>({...prev, "scalarsTo":newScalars}))
      setSearchInputs(prev => ({ ...prev, start_date: dateStr }));
      if(searchInputs.return_date) {
        if(newDate > new Date(searchInputs.return_date)) {
          await handleReturnDateChange(addDays(date, 2))
        }
      }
    };
  
    async function handleReturnDateChange(date, isString=false) {
      let dateStr = ""
      if(isString) {
        dateStr = date
      } else {
        dateStr = formatDate(date)
      }
      const newScalars = await getFlightScalars(dateStr, results.flightsReturn.length)
      setResults(prev=>({...prev, "scalarsReturn":newScalars}))
      setSearchInputs(prev => ({ ...prev, return_date: dateStr }));
    };


  async function handleFlightSelectionIdOnly(flightId) {
    const targetFlight = displayedFlights.filter(flight=>flight._id === flightId)[0]
    await handleFlightSelection(targetFlight._id, targetFlight.airline, targetFlight.airline_logo)
  }

  async function handleFlightSelection(flightId, airline, airlineLogoUrl) {
    if(searchInputs.trip_type==="Round-trip" && !isReturnFlightPage) {
      setBookingDetails(prev=>({...prev, "departing":flightId}))
      setDepartFlight(
        {flightId,
          airline,
          airlineLogoUrl
        })
        setIsReturnFlightPage(true)
      } else if(searchInputs.trip_type==="One-way" && !isReturnFlightPage) {
        setBookingDetails(prev=>({...prev, "departing":flightId}))
        setDepartFlight(
          {flightId,
          airline,
          airlineLogoUrl
        })
        navigate('/confirmation')
      } else if (searchInputs.trip_type==="Round-trip" && isReturnFlightPage) {
          setBookingDetails(prev=>({...prev, "returning":flightId}))
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

        const flightArray = results.flightsTo.map((flight,index) => {
        const adjTripCost = Math.ceil(flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type] * results.scalarsTo[index]);
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
        
    }}, []);

    useEffect(() => {
      const flightArray = results.flightsReturn.map((flight,index) => {
      const adjTripCost = Math.ceil(flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type] * results.scalarsReturn[index]);
      const bagFees = getCarryFees(flight.airline, flight.num_carryOn) * searchInputs.num_passengers;
      const checkedFees = getCheckedFees(flight.airline, searchInputs.num_checked) * searchInputs.num_passengers;
        
        return {
          ...flight,
          adjTripCost: adjTripCost, // Assign directly
          bagFees: bagFees, // Assign directly
          checkedFees: checkedFees, // Assign directly
          totalFlightCost: adjTripCost + bagFees + checkedFees // Calculate total cost
        };
      })

      setResults(prev=>({...prev, 'flightsReturn':flightArray}))

    },[]);

  useEffect(() => {

        const flightArray = results.flightsTo.map((flight,index) => {
        const adjTripCost = Math.ceil(flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type] * results.scalarsTo[index]);
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

        if(!isReturnFlightPage) {
          setDisplayedFlights(sortFlights(flightArray, sortMethod))
        }

  }, [searchInputs.trip_type, searchInputs.num_passengers, searchInputs.seat_type, searchInputs.num_checked, searchInputs.num_carryOn, 
    searchInputs.start_date, searchInputs.flying_from, searchInputs.flying_to]);

  useEffect(() => {

        const flightArray = results.flightsReturn.map((flight,index) => {
        const adjTripCost = Math.ceil(flight.trip_cost * searchInputs.num_passengers * seatScalar[searchInputs.seat_type] * results.scalarsReturn[index]);
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

        if(isReturnFlightPage) {
          setDisplayedFlights(sortFlights(flightArray, sortMethod))
        }

  }, [searchInputs.trip_type, searchInputs.num_passengers, searchInputs.seat_type, searchInputs.num_checked, searchInputs.num_carryOn, 
    searchInputs.return_date, searchInputs.flying_from, searchInputs.flying_to]);


  useEffect(()=> {
    if(isReturnFlightPage) {
      setDisplayedFlights(sortFlights(results.flightsReturn, sortMethod))
    } else {
      setDisplayedFlights(sortFlights(results.flightsTo, sortMethod))
    }
  }, [isReturnFlightPage])

  return (
    <Box sx={{display:'flex'}}>
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
        <TripOptionsBar isMobile={isMobile} />
        <FlightSearchBar 
          isMobile={isMobile} 
          handleStartDateChange={handleStartDateChange}
          handleReturnDateChange={handleReturnDateChange}
          handleAirportChange={handleSingleAirportChange}
        />

        <FilterComponent 
          displayedFlights={displayedFlights} 
          setDisplayedFlights={setDisplayedFlights} 
          isReturnFlightPage={isReturnFlightPage}
          airlinesFilter = {airlinesFilter}
          setAirlinesFilter = {setAirlinesFilter}
          priceFilter = {priceFilter}
          setPriceFilter = {setPriceFilter}
          stopsFilter = {stopsFilter}
          setStopsFilter = {setStopsFilter}
          timeFilter = {timeFilter}
          setTimeFilter = {setTimeFilter}
          layoverDuration = {layoverDuration}
          setLayoverDuration = {setLayoverDuration}
          totalDuration = {totalDuration}
          setTotalDuration = {setTotalDuration}
          filterOptions={filterOptions}
          isStopsFilter={isStopsFilter}
          setIsStopsFilter={setIsStopsFilter}
          isAirlinesFilter={isAirlinesFilter}
          setIsAirlinesFilter={setIsAirlinesFilter}
          isPriceFilter={isPriceFilter}
          setIsPriceFilter={setIsPriceFilter}
          isTimeFilter={isTimeFilter}
          setIsTimeFilter={setIsTimeFilter}
          isConnectingAirportsFilter={isConnectingAirportsFilter}
          setIsConnectingAirportsFilter={setIsConnectingAirportsFilter}
          isDurationFilter={isDurationFilter}
          setIsDurationFilter={setIsDurationFilter}/>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: isMobile ? '100%' : '82%', gap: 2 }}>
        {isReturnFlightPage &&
            <SelectedFlightPill
              departFlight={departFlight}
              setIsReturnFlightPage={setIsReturnFlightPage}/>
          }
          <SortTitleBar 
          sortMethod={sortMethod} 
          handleSort={handleSort} 
          isMobile={isMobile} 
          isReturnFlightPage={isReturnFlightPage}/>
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
              <p className="update-text">Updating Results...</p>
              <CircularProgress />
            </Box>
          ) : (
            displayedFlights.length > 0 ? (
              displayedFlights.map((flight, index) => (
                <FlightCard 
                  key={index} 
                  isMobile={isMobile} 
                  flightData={flight} 
                  isReturnFlightPage={isReturnFlightPage}
                  handleFlightSelection={handleFlightSelection}
                />
              ))
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
                <p className="no-match-text">No matching results found</p>
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
        }
      <ChatModal 
      open={isChatOpen} 
      onClose={handleChatClose}
      handleMultipleAirportChange={handleMultipleAirportChange} 
      handleSingleAirportChange={handleSingleAirportChange}
      handleStartDateChange={handleStartDateChange}
      handleReturnDateChange={handleReturnDateChange}
      setAirlinesFilter = {setAirlinesFilter}
      setPriceFilter = {setPriceFilter}
      setStopsFilter = {setStopsFilter}
      setTimeFilter = {setTimeFilter}
      setLayoverDuration = {setLayoverDuration}
      setTotalDuration = {setTotalDuration}
      handleSort={handleSort}
      handleFlightSelectionIdOnly={handleFlightSelectionIdOnly}
      setIsLoading={setIsLoading}
      getCompletedObject={getCompletedObject}
      getFilterObject={getFilterObject}
      getDisplayedFlightsObject={getDisplayedFlightsObject}
      resetFilters={resetFilters}/>
    </Box>
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
      
      case 'Earliest Takeoff':
        return extractTime(a.start_time) - extractTime(b.start_time);
      
      case 'Earliest Arrival':
        return extractTime(a.end_time) - extractTime(b.end_time);
      
      case 'Latest Takeoff':
        return extractTime(b.start_time) - extractTime(a.start_time);
      
      case 'Latest Arrival':
        return extractTime(b.end_time) - extractTime(a.end_time);
      
      default:
        return 0; // No sorting
    }
  });
}

export default FlightResultsPage;
