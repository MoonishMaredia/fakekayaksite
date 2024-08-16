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
import { useBooking } from '../components/BookingContext'
import { useNavigate } from 'react-router-dom';
import {getFlightScalars, getFlightResults} from '../utils/api.js'
import ChatModal from '../components/ChatModalResults'
import moment from 'moment';



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
  const { searchInputs, setSearchInputs } = useInput({});
  const { results, setResults } = useResults({});
  const { bookingDetails, setBookingDetails } = useBooking({});

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
  const [airlinesFilter, setAirlinesFilter] = useState({});
  const [connectingAirports, setConnectingAirports] = useState([]);
  const [priceFilter, setPriceFilter] = useState(0);
  const [stopsFilter, setStopsFilter] = useState(100);
  const [timeFilter, setTimeFilter] = useState({ 'departure': [0, 24], 'arrival': [0, 24] });
  const [layoverDuration, setLayoverDuration] = useState([0, 0]);
  const [totalDuration, setTotalDuration] = useState([0, 0]);

  function handleSort(value) {
    setSortMethod(value)
    setDisplayedFlights(sortFlights(displayedFlights, value))
  }

  const handleAirportsFilterSelection = (airportIds) => {
    setConnectingAirports((prevAirports) => {
      return prevAirports.map(airport=> {
        if(airportIds.includes(airport.id)) {
          airport.checked=true
        }
        return airport
      })
    });
  };

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
          handleReturnDateChange(addDays(date, 2))
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

  function handleFlightSelection(flightId, airline, airlineLogoUrl) {
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

  }, [searchInputs.num_passengers, searchInputs.seat_type, searchInputs.num_checked, searchInputs.num_carryOn, 
    searchInputs.start_date, searchInputs.flying_from]);

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

  }, [searchInputs.num_passengers, searchInputs.seat_type, searchInputs.num_checked, searchInputs.num_carryOn, 
    searchInputs.return_date, searchInputs.flying_to]);


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
        {/* <button onClick={()=>setIsReturnFlightPage(prev=>!prev)}>Click ME</button> */}
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
          connectingAirports = {connectingAirports}
          setConnectingAirports = {setConnectingAirports}
          priceFilter = {priceFilter}
          setPriceFilter = {setPriceFilter}
          stopsFilter = {stopsFilter}
          setStopsFilter = {setStopsFilter}
          timeFilter = {timeFilter}
          setTimeFilter = {setTimeFilter}
          layoverDuration = {layoverDuration}
          setLayoverDuration = {setLayoverDuration}
          totalDuration = {totalDuration}
          setTotalDuration = {setTotalDuration}/>
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
      <ChatModal 
      open={isChatOpen} 
      onClose={handleChatClose}
      handleMultipleAirportChange={handleMultipleAirportChange} 
      handleSingleAirportChange={handleSingleAirportChange}
      handleStartDateChange={handleStartDateChange}
      handleReturnDateChange={handleReturnDateChange}
      setAirlinesFilter = {setAirlinesFilter}
      handleAirportsFilterSelection = {handleAirportsFilterSelection}
      setPriceFilter = {setPriceFilter}
      setStopsFilter = {setStopsFilter}
      setTimeFilter = {setTimeFilter}
      setLayoverDuration = {setLayoverDuration}
      setTotalDuration = {setTotalDuration}
      // setLoading={setLoading}
      // handleSubmit={handleSubmit}
      // getCompletedObject={getCompletedObject}
      // fieldErrors={fieldErrors}
      // setFieldErrors={setFieldErrors}
      />
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
