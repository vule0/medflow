import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#14967f",
        },

        secondary: {
            main: "#0d6e39",
        },
        background: { default: "#f4f7f4" },
    },

    shape: {
        borderRadius: 10,
    },
    typography: {
    h4: { fontWeight: 700 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
    subtitle1: { fontWeight: 600},
  },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 10,
                    // fontWeight: 600,
                    padding: "8px 16px",
                },

                
            },
        },
    },
});

export default theme;