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

const ChatModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);
  const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true
  });

  const sendMessage = async (message) => {
    try {
      setMessages((prev) => [{ sender: 'user', text: message }, ...prev]);
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Give me an interesting example application of the laws of physics applied to everyday phenomena" },
        ],
        model: "gpt-4o-mini",
      });
      setMessages((prev) => [{ sender: 'ai', text: completion.choices[0].message.content }, ...prev]);
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
            >
              <Typography>{msg.text}</Typography>
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
