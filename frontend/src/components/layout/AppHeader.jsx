import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material'
import SavingsIcon from '@mui/icons-material/Savings';
import { useAuth } from '../../context/AuthContext';

function AppHeader() {
    const {user, logout} = useAuth()
    const username= user?.sub 
    const role= user?.role

    return (
        <AppBar position="static">
            <Toolbar>
                <SavingsIcon sx={{mr: 2}}/>
                <Typography variant="h6" component="h1">
                   MedFlow Clinical Equipment Command Center
                </Typography>
                {username && (
                    <Box sx={{display: 'flex', alignItems:'center', gap: 2, ml: 'auto'}}>
                        <Typography variant="body2">{username} ({role})</Typography>
                        <Button color="inherit" onClick={logout}>Log Out</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;