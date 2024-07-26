import React, { useState, useRef, useEffect } from 'react';
import OpenAI from "openai";
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

const ChatModal = ({ 
    open, onClose,
    tripType, setTripType,
    flyingFrom, setFlyingFrom,
    flyingTo, setFlyingTo,
    startDate, setStartDate,
    returnDate, setReturnDate,
    adults, setAdults,
    children, setChildren,
    carryOnBags, setCarryOnBags,
    checkedBags, setCheckedBags 
  }) => {
  const [aiMessages, setAIMessages] = useState([])
  const [messages, setMessages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);

  function getCompletedObject() {
    const obj = {
      "trip_type":tripType,
      "flying_from":flyingFrom,
      "flying_to":flyingTo,
      "start_date":startDate,
      "return_date":returnDate,
      "num_adults":adults,
      "num_kids":children,
      "num_carryOn":carryOnBags,
      "num_checked":checkedBags
    }

    const objStr = JSON.stringify(obj)

    return objStr
  }

  function commandCenter(codeResponse) {

    const modifiedStr = codeResponse.replace(/(\w+)/, '"$1"');
    // Parse the modified string to get the array
    const array = JSON.parse(modifiedStr);
    console.log(array);

  }

  const sendMessage = async (userMessage) => {
    try {
      setMessages((prev) => [{ sender: 'user', text: userMessage }, ...prev]);
      const prevAIMessage = aiMessages ? aiMessages[aiMessages.length - 1] : ""
      const inputObjString = getCompletedObject()
      console.log("Send:", userMessage, prevAIMessage, inputObjString)
      const [codeResponse, userResponse] = await makeGPTRequests(userMessage, prevAIMessage, inputObjString)
      console.log("Return:", codeResponse, userResponse)
      const htmlContent = marked(userResponse); // Convert Markdown to HTML
      setMessages((prev) => [{ sender: 'ai', text: htmlContent }, ...prev]);
      setAIMessages((prev) => [userResponse, ...prev])
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
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column-reverse' }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={msg.sender === 'user' ? messageStyle.user : messageStyle.ai}
              dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML content
            >
              {/* <Typography>{msg.text}</Typography> */}
            </Box>
          ))}
          <div ref={messagesEndRef} />
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
        </Box>
      </Box>
    </Box>
  );
};

export default ChatModal;
