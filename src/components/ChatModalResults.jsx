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
import { marked } from 'marked'; // Import marked for Markdown parsing
import { makeGPTRequests, makeTriageRequests, getFlightResults} from '../utils/api';
import { getLandingResultsChatHTML, getLandingResultsChatMessage } from '../utils/other';
import {airportCodes} from '../busyairportcodes'
import { useInput } from './InputContext'
import { useResults } from './ResultsContext'


const ChatModal = ({open, onClose, 
  handleMultipleAirportChange, 
  handleSingleAirportChange,
  handleStartDateChange,
  handleReturnDateChange}) => {

  const {searchInputs, setSearchInputs} = useInput({});
  const {results, setResults} = useResults({})
  const [aiMessages, setAIMessages] = useState([getLandingResultsChatMessage()])
  const [messages, setMessages] = useState([{sender: 'ai', text: getLandingResultsChatHTML()}]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);
  const [isDisabled, setIsDisabled]= useState(false)
  
  

  function verifyMinMaxType(field, arg) {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) {
      return {"msg":400, "error":"there was an error processing your request"}
    } else if(field === "num_passengers" && (![1, 2, 3, 4, 5].includes(parsed))) {
      // setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be between 1 and 5"});
      return {"msg":400, "error": "Number of passengers should be between 1 and 5"}
    } else if(field === "num_carryOn" && (![0, 1].includes(parsed))) {
      return {"msg":400, "error": "Number of carry on bags should be 0 or 1"}
    } else if(field === "num_checked" && (![0, 1, 2, 3].includes(parsed))) {
      return {"msg":400, "error": "Number of carry on bags should be between 1 and 3"}
    } else {
      // setFieldErrors({...fieldErrors, [field]: ""})
      return {"msg":200, "arg":arg}
    }
  }

  function verifyAirportCode(airportSource1, arg1, airportSource2=null, arg2=null, multipleArgs=false) {
    if(multipleArgs) {
      if(arg1===arg2) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same."}
      } else if(!airportCodes.hasOwnProperty(arg1) || !airportCodes.hasOwnProperty(arg2)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport(s) are not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200}
      } 
    } else if(airportSource1==="setFlyingFrom") {
      if(arg1===searchInputs.flying_to) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same"}
      } else if(!airportCodes.hasOwnProperty(arg1)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport is not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200, "arg":arg1}
      }
    } else if(airportSource1==="setFlyingTo") {
      if(arg1===searchInputs.flying_from) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same"}
      } else if(!airportCodes.hasOwnProperty(arg1)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport is not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200, "arg":arg1}
      }
    }
  }

  function verifyDate(dateType, arg) {

    const [year, month, day] = arg.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day+1));
    const todayDate = new Date()
    if(dateType==='start_date') {
      if(utcDate < todayDate) {
        return {"msg":400, "error":"Invalid date. Start date is earlier than current date"}
      } else {
        return {"msg":200}
      }
    } else if(dateType==="return_date") {
        if(searchInputs.start_date & new Date(utcDate.toISOString()) < searchInputs.start_date)  {
          return {"msg":400, "error":"Invalid date. Start date is earlier than current date"}
      } else {
        return {"msg":200}
      }
    }
  }


  function runSetFunctions(setter, arg) {

    console.log("Inside set functions")

    if(setter==="setTripType") {
      // console.log("Setting trip type")
      if(!['Round-trip','One-way'].includes(arg)) {
        return {"msg":400, "error":"invalid specification for trip type, should be Round-trip or One-Way"}
      } else {
        setSearchInputs(prev=>({...prev, 'trip_type': arg}))
        return {"msg":200}
      }

    } else if(setter==="setStartDate") {
      // console.log("Setting start date")
      const res = verifyDate("start_date", arg)
      if(res.msg===200) {
        handleStartDateChange(arg, true)
        return {"msg":200}
      } else {
        return {"msg":400, "error":res.error}
      }

    } else if(setter==="setReturnDate") {
      // console.log("Setting return date")
      const res = verifyDate("return_date", arg)
      if(res.msg===200) {
        handleReturnDateChange(arg, true)
        return {"msg":200}
      } else {
        return {"msg":400, "error":res.error}
      }

    } else if(setter==="setPassengers") {
      // console.log("Setting # of passengers")
      const res = verifyMinMaxType("num_passengers", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_passengers': parseInt(res.arg)}))
        return {"msg":200}
      } else {
        return {"msg":400, "error":res.error}
      }
    
    } else if(setter==="setSeatType") {
      // console.log("Setting seat type")
     if(!['Economy','Business'].includes(arg)) {
      return {"msg":400, "error":"Invalid ticket type. It should be either Economy or Business"}
    } else {
      setSearchInputs(prev=>({...prev, 'seat_type': arg}))
      return {"msg":200}
    }

    } else if(setter==="setCarryOnBags") {
      // console.log("Setting # of carry on bags")
      const res = verifyMinMaxType("num_carryOn", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_carryOn': parseInt(res.arg)}))
        return {"msg":200}
      } else {
        return {"msg":400, "error":res.msg}
      }

    } else if(setter==="setCheckedBags") {
      // console.log("Setting # of checked bags")
      const res = verifyMinMaxType("num_checked", arg)
      if(res.msg===200) {
        setSearchInputs(prev=>({...prev, 'num_checked': parseInt(res.arg)}))
        return {"msg":200}
      } else {
        return {"msg":400, "error":res.msg}
      }
      
    } else {
      console.log("There was an error!")
    }
  }

  async function runUpdateFunction(userMessage, prevAIMessage) {

    // const updateResponse = await makeUpdateRequest(userMessage, prevAIMessage)
    const updateResponse = "[setFlyingFrom, IAH, setFlyingTo, PHX, setStartDate, 2024-11-22, setPassengers, 4, setCheckedBags, 3]"
    const cleanedResponse = updateResponse.replace(/\[|\]/g, '');
    const array = cleanedResponse.split(',').map(str => str.trim());
    let returnMsg = {}

    console.log("Inside run update function. Here's the array of updates:", array)

    try {
      for (let i = 0; i < array.length; i += 2) {
        const setter1 = array[i];
        const arg1 = array[i + 1];
        // console.log(setter1, arg1)
        if(['setFlyingFrom','setFlyingTo'].includes(setter1) && i+3 < array.length && ['setFlyingFrom','setFlyingTo'].includes(array[i+2])) {
          const setter2 = array[i+2]
          const arg2 = array[i+3]
          // console.log(setter2, arg2)
          returnMsg = await runUpdateSubFunctions(setter1, arg1, setter2, arg2, true);
          i+=2
        } else {
            returnMsg = await runUpdateSubFunctions(setter1, arg1)
        }

        if(returnMsg.msg===400) {
          setMessages((prev) => [{sender: 'ai', text: returnMsg.error }, ...prev]);
          return
        } else  {
          console.log("Continuing")
          continue
        }
        }
      } catch (error) {
        console.error("Error parsing or processing response:", error);
      }
    }

  async function runUpdateSubFunctions(setter1, arg1, setter2=null, arg2=null, multipleArgs=false) {

    console.log("Inside run update sub function. Here's the args:", setter1, arg1, setter2, arg2)

    if(multipleArgs) {
      const message = verifyAirportCode(setter1, arg1, setter2, arg2, multipleArgs=true)
      if(message.msg === 400) {
        return {"msg":400, "error":message.error}
      } else {
        console.log("Getting Results")
        // setSearchInputs(prev=>({...prev, 'flying_from':arg1, 'flying_to':arg2}))
        handleMultipleAirportChange(arg1, arg2)
      }
      return {"msg":200}
    }

    if(['setFlyingFrom','setFlyingTo'].includes(setter1)) {
      const message = verifyAirportCode(setter1, arg1)
      if(message.msg===400) {
        return {"msg":400, "error":message.error}
      } else {
        if(setter1==="setFlyingFrom") {
          // console.log("Getting Results")
          handleSingleAirportChange(true, arg1)
        } else if(setter1==="setFlyingTo") {
          // console.log("Getting Results")
          handleSingleAirportChange(false, arg1)
        }
      }
      return {"msg":200}
    } else {
      // console.log("Running other set functions")
      const result = runSetFunctions(setter1, arg1)
      return result
    }
  }

  function commandCenter(triageResponse, userMessage, prevAIMessage) {

    try {

      if (triageResponse === "[]") {
        // console.log("Nothing to run");
        setMessages((prev) => [{sender: 'ai', text: "I'm sorry I didn't understand your last message. Can you be more specific?" }, ...prev]);
        return;
      }
      const cleanedResponse = triageResponse.replace(/\[|\]/g, '');
      const array = cleanedResponse.split(',').map(str => str.trim());

      console.log("Triage Array:", array, triageResponse, cleanedResponse)
      
      for (let i = 0; i < array.length; i++) {
        const action = array[i];
        console.log("Action:", action)
        if(action==="update") {
          console.log("I am here")
          runUpdateFunction(userMessage, prevAIMessage)
        } else {
          // runActionFunction(action);
          console.log("Run action function later!")
        }
      }
    } catch (error) {
      console.error("Error parsing or processing response:", error);
    }
  }

  const sendMessage = async (userMessage) => {
    try {
      setIsDisabled(true)
      setMessages((prev) => [{ sender: 'user', text: userMessage }, ...prev]);
      const prevAIMessage = aiMessages ? aiMessages[aiMessages.length - 1] : ""
      const triageResponse = await makeTriageRequests(userMessage, prevAIMessage)
      console.log(triageResponse)
      commandCenter(triageResponse, userMessage, prevAIMessage)

      // setIsDisabled(false)

    //   if(completeResponse==="True") {
    //     handleSubmit()
    //   }

    //   const htmlContent = marked(userResponse); // Convert Markdown to HTML
    //   setMessages((prev) => [{sender: 'ai', text: htmlContent }, ...prev]);
    //   setAIMessages((prev) => [...prev, userResponse])
    //   commandCenter(codeResponse)
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  const drawerStyle = {
    width: isMobile ? '100%' : '22%',
    height: '100vh',
    position: 'fixed',
    right: 0,
    top: 0,
    display: open ? 'block' : 'none',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[5],
    zIndex: theme.zIndex.drawer + 2,
  };

  const messageStyle = {
    user: {
      alignSelf: 'flex-end',
      background: '#e0f7fa',
      padding: '8px',
      borderRadius: '8px',
      margin: '4px 0',
      maxWidth: '80%',
    },
    ai: {
      alignSelf: 'flex-start',
      background: '#e8eaf6',
      padding: '8px',
      borderRadius: '8px',
      margin: '4px 0',
      maxWidth: '90%',
      fontSize:"14px",
      fontWeight:"400"
    },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={drawerStyle}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Book with AI
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection:'column-reverse'}}>
          {messages.map((msg, index) => (
            <Box
              className="messages"
              key={index}
              sx={msg.sender === 'user' ? messageStyle.user : messageStyle.ai}
              dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML content
            >
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 'auto', borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            disabled={isDisabled}
            placeholder="Message GPT"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage(e.target.value);
                e.target.value = '';
              }
            }}
            sx={{ bgcolor: 'rgb(248 250 252)', borderRadius: 1 }}
          />
          <div ref={messagesEndRef} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatModal;
