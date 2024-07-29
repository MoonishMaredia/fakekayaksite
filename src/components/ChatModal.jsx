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
import { makeGPTRequests } from '../utils/api';
import { getLandingChatHTML, getLandingChatMessage } from '../utils/other';
import {airpotCodes} from '../airportcodes.js'
import { useNavigate } from 'react-router-dom';

const ChatModal = ({ 
    open, onClose, setLoading,
    tripType, setTripType,
    flyingFrom, setFlyingFrom,
    flyingTo, setFlyingTo,
    startDate, setStartDate,
    returnDate, setReturnDate,
    passengers, setPassengers,
    seatType, setSeatType,
    carryOnBags, setCarryOnBags,
    checkedBags, setCheckedBags 
  }) => {

  const navigate = useNavigate();
  const [aiMessages, setAIMessages] = useState([getLandingChatMessage()])
  const [messages, setMessages] = useState([{sender: 'ai', text: getLandingChatHTML()}]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({
    "trip_type":"",
    "flying_from":"",
    "flying_to":"",
    "start_date":"",
    "return_date":"",
    "num_passengers":"",
    "num_carryOn":"",
    "num_checked":""
  })

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function handleSubmit() {
    onClose()
    setLoading(true)
    await sleep(7000)
    navigate('/results')
  }

  function getCompletedObject() {
    const objStr = {
      "trip_type": tripType,
      "flying_from": flyingFrom!=="" ? flyingFrom : fieldErrors.flying_from,
      "flying_to": flyingTo!=="" ? flyingTo : fieldErrors.flying_to,
      "start_date": startDate!==null  ? startDate : fieldErrors.start_date,
      "return_date": returnDate!==null ? returnDate : fieldErrors.return_date,
      "num_passengers": passengers!==null ? passengers : fieldErrors.num_passengers,
      "seat_type": seatType!==null ? seatType : fieldErrors.seatType,
      "num_carryOn": carryOnBags!==null ? carryOnBags : fieldErrors.num_carryOn,
      "num_checked": checkedBags!==null ? checkedBags : fieldErrors.num_checked
    };

    return objStr
  }

  function verifyMinMaxType(field, arg) {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) {
      setFieldErrors({...fieldErrors, [field]:"#ERROR: Provided value wasn't an integer"})
    } else if(field === "num_passengers" && (![1, 2, 3, 4, 5].includes(parsed))) {
      setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be between 1 and 10"});
      return {"msg":400}
    } else if(field === "num_carryOn" && (![1, 2, 3, 4, 5].includes(parsed))) {
      setFieldErrors({...fieldErrors, [field]: "#ERROR: Provided value should be one of 0,1"});
      return {"msg":400}
    } else if(field === "num_checked" && (![1, 2, 3, 4, 5].includes(parsed))) {
      setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be one of 0,1,2,3,4,5"});
      return {"msg":400}
    } else {
      setFieldErrors({...fieldErrors, [field]: ""})
      return {"msg":200, "arg":arg}
    }
  }

  function verifyAirportCode(airportSource, arg) {
    if(airportSource==="from") {
      if(arg===flyingTo) {
        setFieldErrors({...fieldErrors, "flying_from":"#ERROR: flying_from airport is the same as flying_to airport"})
        return {"msg":400}
      } else if(!airpotCodes.hasOwnProperty(arg)) {
        setFieldErrors({...fieldErrors, "flying_from":"#ERROR: flying_from airport code is not valid. Verify with user"})
        return {"msg":400}
      } else {
        setFieldErrors({...fieldErrors, "flying_from":""})
        return {"msg":200, "arg":arg}
      }
    } else if(airportSource==="to") {
      if(flyingFrom===arg) {
        setFieldErrors({...fieldErrors, "flying_to":"#ERROR: flying_to airport is the same as flying_from airport"})
        return {"msg":400}
      } else if(!airpotCodes.hasOwnProperty(arg)) {
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
        if(startDate & new Date(utcDate.toISOString()) < startDate)  {
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
        setTripType("")
      } else {
        setTripType(arg)
      }

    } else if (setter==="setFlyingFrom") {
      const res = verifyAirportCode("from", arg)
      if(res.msg===200) {
        setFlyingFrom(arg)
      } else {
        setFlyingFrom("")
      }

    } else if(setter==="setFlyingTo") {
      const res = verifyAirportCode("to", arg)
      if(res.msg===200) {
        setFlyingTo(arg)
      } else {
        setFlyingTo("")
      }


    } else if(setter==="setStartDate") {
      const res = verifyDate("start_date", arg)
      if(res.msg===200) {
        setStartDate(new Date(res.arg))
      } else {
        setStartDate(null)
      }

    } else if(setter==="setReturnDate") {
      const res = verifyDate("return_date", arg)
      if(res.msg===200) {
        setReturnDate(new Date(res.arg))
      } else {
        setReturnDate(null)
      }

    } else if(setter==="setPassengers") {
      const res = verifyMinMaxType("num_passengers", arg)
      if(res.msg===200) {
        setPassengers(parseInt(res.arg))
      } else {
        setPassengers(null)
      }
    
    } else if(setter="setSeatType") {
     if(!['Economy','Business','First'].includes(arg)) {
      setFieldErrors({...fieldErrors, "seat_type":"#ERROR: Invalid value. It should be either Economy or Business or First"})
      setSeatType("")
    } else {
      setSeatType(arg)
    }

    } else if(setter==="setCarryOnBags") {
      const res = verifyMinMaxType("num_carryOn", arg)
      if(res.msg===200) {
        setCarryOnBags(parseInt(res.arg))
      } else {
        setCarryOnBags(null)
      }

    } else if(setter==="setCheckedBags") {
      const res = verifyMinMaxType("num_checked", arg)
      if(res.msg===200) {
        setCheckedBags(parseInt(res.arg))
      } else {
        setCheckedBags(null)
      }
      
    } else {
      console.log("There was an error!")
    }
  }

  function commandCenter(codeResponse) {

    try {

      if (codeResponse === "[]") {
        // console.log("Nothing to run");
        return;
      }

      const cleanedResponse = codeResponse.replace(/\[|\]/g, '');
      const array = cleanedResponse.split(',').map(str => str.trim());
      // console.log(array);
      // console.log(array.length);
      
      for (let i = 0; i < array.length; i += 2) {
        const setter = array[i];
        const arg = array[i + 1];
        // console.log(setter, arg);
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
      // console.log("========Sending========:")
      // console.log("fieldErrors: ", fieldErrors)
      const [completeResponse, codeResponse, userResponse] = await makeGPTRequests(userMessage, prevAIMessage, inputObjString)
      // console.log("Return:", completeResponse, codeResponse, userResponse)

      if(completeResponse==="True") {
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

  const drawerStyle = {
    width: isMobile ? '100%' : '30%',
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
      maxWidth: '80%',
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
              key={index}
              sx={msg.sender === 'user' ? messageStyle.user : messageStyle.ai}
              dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML content
            >
              {/* <Typography>{msg.text}</Typography> */}
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 'auto', borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
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
