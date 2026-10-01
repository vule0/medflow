import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#750909'
        },
        secondary: {
            main: '#0d6e39'
        }
    },
    shape: {
        borderRadius: 8
    }
});


export default theme;