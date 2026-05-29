import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
           <Link to='/'>LiveEvents</Link> 
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap:'200px'}}>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{ backgroundColor: 'white'  }}/>
          <Button color="inherit">Create Event</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}