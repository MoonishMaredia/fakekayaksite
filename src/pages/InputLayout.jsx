import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import HeaderLayout from '../components/HeaderLayout';
import SearchForm from '../components/SearchForm';
import ChatModal from '../components/ChatModal';

const InputLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderLayout onChatOpen={handleChatOpen} />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Container maxWidth="sm" sx={{ mt: 4 }}>
            <SearchForm />
          </Container>
        </Box>
      </Box>
      <ChatModal open={isChatOpen} onClose={handleChatClose} />
    </Box>
  );
};

export default InputLayout;
