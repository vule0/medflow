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

        background: {
            default: "#f4f7f4",
        },
    },

    shape: {
        borderRadius: 10,
    },

    typography: {
        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 650,
        },

        h6: {
            fontWeight: 650,
        },

        subtitle1: {
            fontWeight: 600,
        },
    },

    components: {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 8,
                    boxShadow: "none",

                    "&:before": {
                        display: "none",
                    },

                    "&:first-of-type": {
                        borderRadius: 8,
                    },

                    "&:last-of-type": {
                        borderRadius: 8,
                    },
                },
            },
        },

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
        MuiCard : {
            styleOverrides: {
                root: {
                    width: "100%",
                    borderRadius: 15,
                    transition: "0.2s",
                     "&:hover": {
                        boxShadow: 2,
                        transform: "translateY(-2px)",
                        },
                }
            }
        }
    },
});

export default theme;