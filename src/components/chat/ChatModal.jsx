import React, { useState, useRef, useEffect } from 'react';
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
import { makeGPTRequests} from '../../utils/api';
import { getLandingChatHTML, getLandingChatMessage } from '../../utils/other';
import {airportCodes} from '../../busyairportcodes'
import { useInput } from '../InputContext'

const ChatModal = ({open, 
  onClose, 
  handleSubmit, 
  getCompletedObject, 
  fieldErrors, 
  setFieldErrors, 
  handleStartDateChange,
  handleReturnDateChange}) => {

  const {searchInputs, setSearchInputs} = useInput({});
  const [aiMessages, setAIMessages] = useState([getLandingChatMessage()])
  const [messages, setMessages] = useState([{sender: 'ai', text: getLandingChatHTML()}]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);
  const [isDisabled, setIsDisabled]= useState(false)

  function verifyMinMaxType(field, arg) {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) {
      setFieldErrors({...fieldErrors, [field]:"#ERROR: Provided value wasn't an integer"})
    } else if(field === "num_passengers" && (![1, 2, 3, 4, 5].includes(parsed))) {
      setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be between 1 and 5"});
      return {"msg":400}
    } else if(field === "num_carryOn" && (![0, 1].includes(parsed))) {
      setFieldErrors({...fieldErrors, [field]: "#ERROR: Provided value should be one of 0,1"});
      return {"msg":400}
    } else if(field === "num_checked" && (![0, 1, 2, 3].includes(parsed))) {
      setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be one of 0,1,2,3"});
      return {"msg":400}
    } else {
      setFieldErrors({...fieldErrors, [field]: ""})
      return {"msg":200, "arg":arg}
    }
  }

  function verifyAirportCode(airportSource, arg) {
    if(airportSource==="from") {
      if(arg===searchInputs.flying_to) {
        setFieldErrors({...fieldErrors, "flying_from":"#ERROR: flying_from airport is the same as flying_to airport"})
        return {"msg":400}
      } else if(!airportCodes.hasOwnProperty(arg)) {
        setFieldErrors({...fieldErrors, "flying_from":"#ERROR: flying_from airport code is not valid. Verify with user"})
        return {"msg":400}
      } else {
        setFieldErrors({...fieldErrors, "flying_from":""})
        return {"msg":200, "arg":arg}
      }
    } else if(airportSource==="to") {
      if(searchInputs.flying_from===arg) {
        setFieldErrors({...fieldErrors, "flying_to":"#ERROR: flying_to airport is the same as flying_from airport"})
        return {"msg":400}
      } else if(!airportCodes.hasOwnProperty(arg)) {
        setFieldErrors({...fieldErrors, "flying_to":"#ERROR: flying_to airport is not valid. Verify with user"})
        return {"msg":400}
      } else {
        setFieldErrors({...fieldErrors, "flying_to":""})
        return {"msg":200, "arg":arg}
      }
    }
  }

  function verifyDate(dateType, arg) {

    const [year, month, day] = arg.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day+1));
    const todayDate = new Date()
    if(dateType==='start_date') {
      if(utcDate < todayDate) {
        setFieldErrors({...fieldErrors, "start_date":"#ERROR: Start date is earlier than current date"})
        return {"msg":400}
      } else {
        setFieldErrors({"start_date":"", ...fieldErrors})
        return {"msg":200, "arg":utcDate.toISOString()}
      }
    } else if(dateType==="return_date") {
        if(searchInputs.start_date & new Date(utcDate.toISOString()) < searchInputs.start_date)  {
          setFieldErrors({...fieldErrors, "start_date":"#ERROR: Start date is earlier than current date"})
          return {"msg":400}
      } else {
        setFieldErrors({"return_date":"", ...fieldErrors})
        return {"msg":200, "arg":utcDate.toISOString()}
      }
    }
  }

  function runSetFunctions(setter, arg) {
    if(setter==="setTripType") {
      if(!['Round-trip','One-way'].includes(arg)) {
        setFieldErrors({...fieldErrors, "trip_type":"#ERROR: Invalid value. It should be either Round-trip or One-way"})
        setSearchInputs(prev=>({...prev, 'trip_type': ""}))
      } else {
        setSearchInputs(prev=>({...prev, 'trip_type': arg}))
      }

    } else if (setter==="setFlyingFrom") {
      const res = verifyAirportCode("from", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'flying_from': arg}))
      } else {
        setSearchInputs(prev=>({...prev, 'flying_from': ""}))
      }

    } else if(setter==="setFlyingTo") {
      const res = verifyAirportCode("to", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'flying_to': arg}))
      } else {
        setSearchInputs(prev=>({...prev, 'flying_to': ""}))
      }


    } else if(setter==="setStartDate") {
      const res = verifyDate("start_date", arg)
      if(res.msg===200) {
        // setSearchInputs(prev=>({...prev, 'start_date': res.arg}))
        handleStartDateChange(res.arg)
      } else {
        setSearchInputs(prev=>({...prev, 'start_date': null}))
      }

    } else if(setter==="setReturnDate") {
      const res = verifyDate("return_date", arg)
      if(res.msg===200) {
        // setSearchInputs(prev=>({...prev, 'return_date': res.arg}))
        handleReturnDateChange(res.arg)
      } else {
        setSearchInputs(prev=>({...prev, 'return_date': null}))
      }

    } else if(setter==="setPassengers") {
      const res = verifyMinMaxType("num_passengers", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_passengers': parseInt(res.arg)}))
      } else {
        setSearchInputs(prev=>({...prev, 'num_passengers': null}))
      }
    
    } else if(setter==="setSeatType") {
     if(!['Economy','Business'].includes(arg)) {
      setFieldErrors({...fieldErrors, "seat_type":"#ERROR: Invalid value. It should be either Economy or Business"})
      setSearchInputs(prev=>({...prev, 'seat_type': ""}))
    } else {
      setSearchInputs(prev=>({...prev, 'seat_type': arg}))
    }

    } else if(setter==="setCarryOnBags") {
      const res = verifyMinMaxType("num_carryOn", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_carryOn': parseInt(res.arg)}))

      } else {
        setSearchInputs(prev=>({...prev, 'num_carryOn': null}))
      }

    } else if(setter==="setCheckedBags") {
      const res = verifyMinMaxType("num_checked", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_checked': parseInt(res.arg)}))
      } else {
        setSearchInputs(prev=>({...prev, 'num_checked': null}))
      }
      
    } else {
      console.log("There was an error!")
    }
  }

  function commandCenter(codeResponse) {

    try {
      if (codeResponse === "[]") {
        return;
      }

      const cleanedResponse = codeResponse.replace(/\[|\]/g, '');
      const array = cleanedResponse.split(',').map(str => str.trim());
      
      for (let i = 0; i < array.length; i += 2) {
        const setter = array[i];
        const arg = array[i + 1];
        runSetFunctions(setter, arg);
      }
    } catch (error) {
      console.error("Error parsing or processing response:", error);
    }
  }

  const sendMessage = async (userMessage) => {
    try {
      setMessages((prev) => [{ sender: 'user', text: userMessage }, ...prev]);
      const prevAIMessage = aiMessages ? aiMessages[aiMessages.length - 1] : ""
      const inputObjString = getCompletedObject()
      const [completeResponse, codeResponse, userResponse] = await makeGPTRequests(userMessage, prevAIMessage, inputObjString)

      if(completeResponse==="True" || completeResponse==="true") {
        handleSubmit()
      }

      const htmlContent = marked(userResponse); // Convert Markdown to HTML
      setMessages((prev) => [{sender: 'ai', text: htmlContent }, ...prev]);
      setAIMessages((prev) => [...prev, userResponse])
      commandCenter(codeResponse)
    } catch (error) {
      console.error("Error fetching response:", error);
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
