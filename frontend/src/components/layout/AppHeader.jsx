import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material'
import { useAuth } from '../../context/AuthContext';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
function AppHeader() {
    const {user, role, logout} = useAuth()
    const username= user?.sub 
    // const role= user?.role

    return (
        <AppBar position="fixed"
        >
            <Toolbar>
                <MonitorHeartIcon sx={{mr: 2}}/>
                <Typography variant="h6" component="h1">
                   MedFlow Clinical Equipment Command Center
                </Typography>
                {username && (
                    <Box sx={{display: 'flex', alignItems:'center', gap: 2, ml: 'auto'}}>
                        <Typography sx={{fontSize: 19}}>{username} ({role})</Typography>
                        <Button sx={{fontSize: 18}} color="inherit" onClick={logout}>Log Out</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;