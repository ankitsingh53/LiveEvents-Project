import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function NavBar() {
const location = useLocation()

  const showSearch = location.pathname ==='/'
  
  return (
    <Box >
      <AppBar position="static" >
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6" component="div" >
           <Link to='/' style={{textDecoration: 'none', color: 'white'}}>LiveEvents</Link> 
          </Typography>
          {showSearch && <TextField id="outlined-basic" placeholder='Search' variant="outlined" sx={{ backgroundColor: 'white', width: '30%'}}/>}
          <Button color="inherit" sx={{backgroundColor: 'grey'}}><Link  to='/create' style={{textDecoration: 'none', color: 'white'}}>Create Event</Link></Button>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}