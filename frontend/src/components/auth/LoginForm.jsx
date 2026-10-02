
import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

function LoginForm() {
    const { login } = useAuth();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState(null);


    const handleSubmit = async (event) => {
        event.preventDefault()
        setError(null);
        try {
            await login( username, password );
        }
        catch (error) {
            if (error.response?.status === 401){
            setError('Incorrect username or password.');
            } else {
                setError("Something went wrong. Please try again shortly.")
            }

        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  minHeight: "100vh", p:2}}>
            <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 4, width: "100%", maxWidth: 420 }}>
                <Box sx={{display:"flex", gap: 1.5, alignItems:"center", justifyContent:"center", mb: 1}}>
                    <MonitorHeartIcon color="primary" fontSize="large"/>
                    <Typography variant="h5">MedFlow</Typography>
                </Box>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField label="Username" fullWidth margin="normal" value={username} onChange={(event) => setUsername(event.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(event) => setPassword(event.target.value)} />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Sign In
                </Button>
            </Paper>
        </Box>
    );
}

export default LoginForm;