import {
    Box,
    Typography,
    Grid
  } from '@mui/material';
import {useInput} from '../components/InputContext.js'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
export default function SelectedFlightPill({departFlight, setIsReturnFlightPage}) {
    
    const {searchInputs, setSearchInputs} = useInput({});

    return (
    <Box onClick={()=>setIsReturnFlightPage(false)} 
    sx={{display: "flex",
        cursor:"pointer", 
        alignItems:'center', 
        mr:"auto"}}>
        <img width="20px" height="auto" src={departFlight.airlineLogoUrl}></img>
        <p className="departing-flight-text">
            <span className="text1">{`${searchInputs.flying_from}–${searchInputs.flying_to}`}</span>
            <span className="text2">></span>
            <span className="text3">Select a returning flight</span>
        </p>
    </Box>
    )
}