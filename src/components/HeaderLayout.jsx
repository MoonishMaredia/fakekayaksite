import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';

const HeaderLayout = ({ onChatOpen }) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          K
        </Typography>
        <IconButton color="inherit" onClick={onChatOpen}>
          <ChatIcon />
          <Typography variant="button" sx={{ ml: 1 }}>
            AI
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderLayout;