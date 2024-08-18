import React from 'react';
import { Box, Typography } from '@mui/material';

const LoadingIndicator = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1,
    }}
  >
    <Box
      sx={{
        width: '200px',
        height: '100px',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '"✈️"',
          fontSize: '24px',
          position: 'absolute',
          left: '-24px',
          top: '50%',
          transform: 'translateY(-50%)',
          animation: 'fly 3s linear infinite',
        },
        '@keyframes fly': {
          '0%': { left: '-24px' },
          '100%': { left: '200px' },
        },
      }}
    />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Preparing your flight search...
    </Typography>
  </Box>
);

export default LoadingIndicator;