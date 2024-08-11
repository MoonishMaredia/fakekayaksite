import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import HeaderLayout from '../components/HeaderLayout';
import FlightCard from '../components/FlightCard';
import {useInput} from '../components/InputContext.js'
import {useResults} from '../components/ResultsContext'
import {useBooking} from '../components/BookingContext.js'

export default function BookingLayout() {

    const {results, setResults} = useResults({});
    const {searchInputs, setSearchInputs} = useInput({});
    const {bookingDetails, setBookingDetails} = useBooking({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const departFlight = results.flightsTo.filter(flight=>flight['_id']===bookingDetails.departing)[0]
    const returnFlight = bookingDetails.returning ? results.flightsReturn.filter(flight=>flight['_id']===bookingDetails.returning)[0] : null

    return (
        <Box sx={{}}>
            <HeaderLayout />
            <Box sx={{display: 'flex', 
                flexDirection:"column",
                justifyContent:'center', 
                ml:'auto',
                mr:'auto',
                mt:10, 
                mb:4,
                width: isMobile ? "95%" : "80%"
            }}>
                <Typography sx={{mb:8, textAlign:'center'}} variant={isMobile ? "body1" : "h4"}>Congratulations, your booking is confirmed. Here are your flight details!</Typography>
                <Typography sx={{mb:2}} variant={isMobile ? "subtitle1" : "h7"}>Departing Flight</Typography>
                <FlightCard 
                isMobile={isMobile}
                flightData={departFlight}
                isReturnFlightPage={false}
                handleFlightSelection={()=>{}}/>
                <Box sx={{mb:4}}></Box>
                {returnFlight && 
                <>
                    <Typography sx={{mb:2}} variant={isMobile ? "subtitle1" : "h7"}>Return Flight</Typography>
                    <FlightCard 
                    isMobile={isMobile}
                    flightData={returnFlight}
                    isReturnFlightPage={true}
                    handleFlightSelection={()=>{}}/>
                </>
                }

            </Box>
        </Box>
    )
}