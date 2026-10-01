import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#147509'
        },
        secondary: {
            main: '#0015ff'
        }
    },
    shape: {
        borderRadius: 8
    }
});


export default theme;