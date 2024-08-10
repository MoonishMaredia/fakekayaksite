import {
    Box,
    Typography,
    Grid
  } from '@mui/material';
import {useInput} from '../components/InputContext.js'
export default function SelectedFlightPill({departFlight}) {
    
    const {searchInputs, setSearchInputs} = useInput({});

    return (
    <Box sx={{display: "flex", alignItems:'center', mt:"5px", backgroundColor: 'black', mr:"auto"}}>
        <Typography variant="body2">
        {`Departing Flight:`}
        </Typography>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
            <img width="40%" height="auto" src={departFlight.airlineLogoUrl}></img>
        </Grid>
        <Typography variant="body2">
        {`${searchInputs.flying_from}–${searchInputs.flying_to}`}
        </Typography>
    </Box>
    )
}