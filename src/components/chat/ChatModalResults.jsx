import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatComponent from './ChatComponent';
import { marked } from 'marked'; // Import marked for Markdown parsing
import { makeGPTRequests, makeTriageRequests, getFlightResults, makeUpdateRequest, makeSortRequest} from '../../utils/api';
import { getLandingResultsChatHTML, getLandingResultsChatMessage, verifyAirportCode, verifyDate, verifyMinMaxType } from '../../utils/other';
import {airportCodes} from '../../busyairportcodes'
import { useInput } from '../InputContext'
import { useResults } from '../ResultsContext'
import { useMutex } from '../MutexContext'


const ChatModal = ({open, onClose, 
  handleMultipleAirportChange, 
  handleSingleAirportChange,
  handleStartDateChange,
  handleReturnDateChange,
  setAirlinesFilter,
  handleAirportsFilterSelection,
  setPriceFilter,
  setStopsFilter,
  setTimeFilter,
  setLayoverDuration,
  setTotalDuration,
  handleSort,
  setIsLoading,
  getCompletedObject}) => {

  const {searchInputs, setSearchInputs} = useInput({});
  const {results, setResults} = useResults({})
  const mutex = useMutex();
  const [aiMessages, setAIMessages] = useState([getLandingResultsChatMessage()])
  const [messages, setMessages] = useState([{sender: 'ai', text: getLandingResultsChatHTML()}]);
  const messagesEndRef = useRef(null);
  const [isDisabled, setIsDisabled]= useState(false)

  async function runSetFunctions(setter, arg) {
    return new Promise((resolve) => {
      switch (setter) {
        case "setTripType":
          if (!['Round-trip', 'One-way'].includes(arg)) {
            resolve({ "msg": 400, "error": "Invalid specification for trip type, should be Round-trip or One-Way" });
          } else {
            setSearchInputs(prev => ({ ...prev, 'trip_type': arg }));
            resolve({ "msg": 200 });
          }
          break;
  
        case "setStartDate":
          const startDateRes = verifyDate("start_date", arg, searchInputs.start_date);
          if (startDateRes.msg === 200) {
            handleStartDateChange(arg, true);
            resolve({ "msg": 200 });
          } else {
            resolve({ "msg": 400, "error": startDateRes.error });
          }
          break;
  
        case "setReturnDate":
          const returnDateRes = verifyDate("return_date", arg, searchInputs.start_date);
          if (returnDateRes.msg === 200) {
            handleReturnDateChange(arg, true);
            resolve({ "msg": 200 });
          } else {
            resolve({ "msg": 400, "error": returnDateRes.error });
          }
          break;
  
        case "setPassengers":
          const passengersRes = verifyMinMaxType("num_passengers", arg);
          if (passengersRes.msg === 200) {
            setSearchInputs(prev => ({ ...prev, 'num_passengers': parseInt(passengersRes.arg) }));
            resolve({ "msg": 200 });
          } else {
            resolve({ "msg": 400, "error": passengersRes.error });
          }
          break;
  
        case "setSeatType":
          if (!['Economy', 'Business'].includes(arg)) {
            resolve({ "msg": 400, "error": "Invalid ticket type. It should be either Economy or Business" });
          } else {
            setSearchInputs(prev => ({ ...prev, 'seat_type': arg }));
            resolve({ "msg": 200 });
          }
          break;
  
        case "setCarryOnBags":
          const carryOnRes = verifyMinMaxType("num_carryOn", arg);
          if (carryOnRes.msg === 200) {
            setSearchInputs(prev => ({ ...prev, 'num_carryOn': parseInt(carryOnRes.arg) }));
            resolve({ "msg": 200 });
          } else {
            resolve({ "msg": 400, "error": carryOnRes.error });
          }
          break;
  
        case "setCheckedBags":
          const checkedRes = verifyMinMaxType("num_checked", arg);
          if (checkedRes.msg === 200) {
            setSearchInputs(prev => ({ ...prev, 'num_checked': parseInt(checkedRes.arg) }));
            resolve({ "msg": 200 });
          } else {
            console.log(checkedRes)
            resolve({ "msg": 400, "error": checkedRes.error });
          }
          break;
  
        default:
          console.log("There was an error!");
          resolve({ "msg": 400, "error": "Unknown setter function" });
      }
    });
  }


  async function runUpdateSubFunctions(setter1, arg1, setter2 = null, arg2 = null, multipleArgs = false) {
    if (multipleArgs) {
      const message = verifyAirportCode(setter1, arg1, searchInputs.flying_from, searchInputs.flying_to, setter2, arg2, multipleArgs = true);
      if (message.msg === 400) {
        return { "msg": 400, "error": message.error };
      } else {
        await handleMultipleAirportChange(arg1, arg2);
      }
      return { "msg": 200 };
    }
    
    let message = null
    if (['setFlyingFrom', 'setFlyingTo'].includes(setter1)) {
      message = verifyAirportCode(setter1, arg1, searchInputs.flying_from, searchInputs.flying_to,);
      if (message.msg === 400) {
        return { "msg": 400, "error": message.error };
      } else {
        if (setter1 === "setFlyingFrom") {
          await handleSingleAirportChange(true, arg1);
        } else if (setter1 === "setFlyingTo") {
          await handleSingleAirportChange(false, arg1);
        }
      }
      return { "msg": 200 };
    } else {
      message = await runSetFunctions(setter1, arg1);
      if(message.msg === 400) {
        return {"msg":400, "error":message.error}
      }
    }
    return {"msg":200}
  }

  async function runUpdateFunction(userMessage) {
    // const updateResponse = "[setFlyingFrom, IAH, setFlyingTo, PHX, setStartDate, 2024-11-22, setPassengers, 3, setCheckedBags, 2]"
    const updateResponse = await makeUpdateRequest(userMessage, getCompletedObject())
    console.log(updateResponse)
    const cleanedResponse = updateResponse.replace(/\[|\]/g, '');
    console.log(cleanedResponse)
    const array = cleanedResponse.split(',').map(str => str.trim());
    console.log(array)

    if(array[0] === "") {
      setMessages((prev) => [{sender: 'ai', text: "Your update request couldn't be completed. Can you restate your request more clearly?" }, ...prev]);
      return {"msg":400};
    }
    
    for (let i = 0; i < array.length; i += 2) {
      const setter1 = array[i];
      const arg1 = array[i + 1];
      if(['setFlyingFrom','setFlyingTo'].includes(setter1) && i+3 < array.length && ['setFlyingFrom','setFlyingTo'].includes(array[i+2])) {
        const setter2 = array[i+2]
        const arg2 = array[i+3]
        const returnMsg = await runUpdateSubFunctions(setter1, arg1, setter2, arg2, true);
        i+=2
        if(returnMsg.msg === 400) {
          setMessages((prev) => [{sender: 'ai', text: `Couldn't complete update request. Encountered the following error: ${returnMsg.error}` }, ...prev]);
          return;
        }
      } else {
        const returnMsg = await runUpdateSubFunctions(setter1, arg1)
        if(returnMsg.msg === 400) {
          console.log(returnMsg)
          setMessages((prev) => [{sender: 'ai', text: `Couldn't complete update request. Encountered the following error: ${returnMsg.error}` }, ...prev]);
          return;
        }
      }
    }
    return {"msg":200}
}


  function formatFilterResponse(filterResponse) {

    const cleanedResponse = filterResponse.slice(1, -1).trim();
    const parts = cleanedResponse.split(/,(?![^{\[]*[}\]])/).map(part => part.trim());
    const filters = {};

    for (let i = 0; i < parts.length; i += 2) {
      const filterName = parts[i];
      let filterValue = parts[i + 1];
      if (filterValue.startsWith('{') && filterValue.endsWith('}')) {
        filterValue = JSON.parse(filterValue.replace(/'/g, '"')); // Parse object
      } else if (filterValue.startsWith('[') && filterValue.endsWith(']')) {
        filterValue = JSON.parse(filterValue.replace(/'/g, '"')); // Parse array
      }
      filters[filterName] = filterValue;
    }
    return filters
  }


  async function runFilterFunction(userMessage) {
    const filterResponse = "[stops, 0, airlines, {'United':true, 'Frontier':false, 'American':false, 'Spirit':false, 'Multiple Airlines': false, 'Delta':false, 'Alaska':false, 'JetBlue':false}, price, 200, departureTime, [7,20], arrivalTime, [1,23], totalDuration, [0,5], connectingAirports, ['DFW']]"
    const finalFilters = formatFilterResponse(filterResponse);
    let returnMsg = null
    const filterPromises = Object.entries(finalFilters).map(([key, value]) => 
      updateFilter(key, value)
    );
    await Promise.all(filterPromises);
  }

  async function updateFilter(filterItem, filterValue) {
    return new Promise((resolve) => {
      switch (filterItem) {
        case "stops":
          setStopsFilter(parseInt(filterValue));
          resolve({ "msg": 200 });
          break;
        case "airlines":
          setAirlinesFilter(filterValue);
          resolve({ "msg": 200 });
          break;
        case "price":
          setPriceFilter(parseInt(filterValue));
          resolve({ "msg": 200 });
          break;
        case "departureTime":
          setTimeFilter(prev => ({...prev, "departure": filterValue.reduce((acc, curr) => [...acc, parseInt(curr)], [])}));
          resolve({ "msg": 200 });
          break;
        case "arrivalTime":
          setTimeFilter(prev => ({...prev, "arrival": filterValue.reduce((acc, curr) => [...acc, parseInt(curr)], [])}));
          resolve({ "msg": 200 });
          break;
        case "connectingAirports":
          handleAirportsFilterSelection(filterValue);
          resolve({ "msg": 200 });
          break;
        case "layoverDuration":
          setLayoverDuration(parseInt(filterValue));
          resolve({ "msg": 200 });
          break;
        case "totalDuration":
          setTotalDuration(filterValue.reduce((acc, curr) => [...acc, parseInt(curr)], []));
          resolve({ "msg": 200 });
          break;
        default:
          resolve({ "msg": 400, "error": "Request processed with an unidentified filter" });
          console.error("Unidentified filter called:", filterItem);
      }
    });
  }

  function updateSort(sortItem) {
    return new Promise((resolve) => {
      switch(sortItem) {
        case "Lowest Total Price":
        case "Shortest Duration":
        case "Earliest Takeoff":
        case "Earliest Arrival":
        case "Latest Takeoff":
        case "Latest Arrival":
          handleSort(sortItem);
          break;
        default:
          handleSort("Lowest Total Price");
      }
      resolve();
    });
  }

  async function runSortFunction(userMessage) {
    const sortResponse = await makeSortRequest(userMessage)
    const cleanedResponse = sortResponse.replace(/\[|\]/g, '');
    const array = cleanedResponse.trim();
    console.log(array)

    if(array[0] === "") {
      setMessages((prev) => [{sender: 'ai', text: "Your sort request couldn't be completed. Can you restate your request more clearly?" }, ...prev]);
      return {"msg":400};
    }
  
    return new Promise((resolve) => {
      updateSort(array);
      resolve();
    });
  }

  async function commandCenter(triageResponse, userMessage) {
    setIsLoading(true)
    try {
      if (triageResponse === "[]") {
        setMessages((prev) => [{sender: 'ai', text: "I'm sorry I didn't understand your last message. Can you be more specific?" }, ...prev]);
        return;
      }
      const cleanedResponse = triageResponse.replace(/\[|\]/g, '');
      const actions = cleanedResponse.split(',').map(str => str.trim());
      
      let returnMsg = null
      for (const action of actions) {
        await mutex.acquire();
        try {
          if (action === "update") {
            returnMsg = await runUpdateFunction(userMessage);
            if(returnMsg.msg===400) {
              return
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } else if (action === "filter") {
            await runFilterFunction(userMessage);

          } else if (action === "sort") {
            await runSortFunction(userMessage);

          }
        } finally {
          mutex.release();
        }
      }
    } catch (error) {
      console.error("Error parsing or processing response:", error);
      mutex.release();
    }
  }

  const sendMessage = async (userMessage) => {
    try {
      setIsDisabled(true)
      setMessages((prev) => [{ sender: 'user', text: userMessage }, ...prev]);
      // const prevAIMessage = aiMessages ? aiMessages[aiMessages.length - 1] : ""
      const triageResponse = await makeTriageRequests(userMessage)
      console.log(triageResponse)
      await commandCenter(triageResponse, userMessage)
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false)
      setIsDisabled(false)
    }
  };

  return (
    <ChatComponent
    open={open}
    onClose={onClose}
    messages={messages}
    isDisabled={isDisabled}
    sendMessage={sendMessage}
    />
  );
};

export default ChatModal;
