import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';

const HeaderLayout = ({ onChatOpen }) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textAlign: 'left'}}>
        <FlightIcon sx={{mr: 1}}/>
          FakeKayak
        </Typography>
        <IconButton color="inherit" onClick={onChatOpen}>
          <ChatIcon />
          <Typography variant="button" sx={{ ml: 1}}>
            AI
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderLayout;