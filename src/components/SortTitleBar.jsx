import React, { useState, useEffect} from 'react';
import { Box, TextField, MenuItem, Typography} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

const customStyles = {
    '& .MuiFormControl': {
        padding: '3px 6px',
        height: '16px',
    },
    '& .MuiInputBase-input': {
        padding: '3px 6px',
        height: '16px',
    },
}

export default function SortTitleBar({isMobile, sortMethod, setSortMethod}) {

    return (
        <Box sx={{
            display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
        <Typography variant={isMobile ? "subtitle4" : "h6"} sx={{ mb: 1, alignSelf:"flex-end" }}> {isMobile ? "" : "Select a"} Departing Flight{isMobile ? "s" : ""}</Typography>
        <Box sx={{display:'flex', 
            flexDirection:'column', 
            alignItems:'left',
            justifyContent:'flex-end',
            width: isMobile ? '40%' : '15%',
            fontSize: isMobile ? '10px' : '14px',
        }}>
            <p>Sort By:</p>
            <TextField
            size="small"
            sx={{...customStyles, 
                cursor:"pointer", 
                }}
            select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            SelectProps={{
                IconComponent: () => <ArrowDropDown sx={{ color:"gray"}} fontSize="small" />,
            }}
            >
            <MenuItem value="Lowest Total Price">Lowest Total Price</MenuItem>
            <MenuItem value="Shortest Duration">Shortest Duration</MenuItem>
            <MenuItem value="Earliest Takeoff Time">Earliest Takeoff</MenuItem>
            <MenuItem value="Earliest Arrival Time">Earliest Arrival</MenuItem>
            <MenuItem value="Latest Takeoff Time">Latest Takeoff</MenuItem>
            <MenuItem value="Latest Arrival Time">Latest Arrival</MenuItem>
        </TextField>
        </Box>
        </Box>
    )
}

        