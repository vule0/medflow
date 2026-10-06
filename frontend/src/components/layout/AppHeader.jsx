import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, Tooltip, IconButton } from '@mui/material'
import { useAuth } from '../../context/AuthContext';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from '../../context/ThemeModeContext';

function AppHeader() {
    const { user, role, logout } = useAuth()
    const { mode, toggleMode } = useThemeMode()
    const username = user?.sub

    const [anchorEl, setAnchorEl] = useState(null);

    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed"
        >
            <Toolbar>
                <MonitorHeartIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="h1"
                    sx={{ 
                        color: "white",
                        fontWeight: 700,
                        letterSpacing: "-0.3px",
                    }}
                >
                    MedFlow Clinical Equipment Command Center
                </Typography>
                {username && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                        <Button color="inherit" onClick={handleMenuOpen}
                            sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                            <Typography sx={{ fontSize: 20 }}>{username}</Typography>
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}>
                            <MenuItem disabled>User ID: {user.id}</MenuItem>
                            <MenuItem disabled>Role: {role}</MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); logout() }}>Log Out</MenuItem>

                        </Menu>
                        <Tooltip
                            title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        >
                            <IconButton
                                onClick={toggleMode}
                                color="inherit"
                                aria-label={
                                    mode === "light"
                                        ? "Switch to dark mode"
                                        : "Switch to light mode"
                                }
                            >
                                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* <Typography sx={{fontSize: 19}}>{username} ({role})</Typography>
                        <Button sx={{fontSize: 18}} color="inherit" onClick={logout}>Log Out</Button> */}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;