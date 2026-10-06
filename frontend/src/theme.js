import { createTheme } from "@mui/material/styles";

const palettes = {
  light: {
    primary: { main: "#14967f" },
    secondary: { main: "#0d6e39" },
    background: {
      default: "#f4f7f4",
    },
    text: {
      primary: "#1b2522",
      secondary: "#53635d",
    },
  },
  dark: {
    primary: { main: "#53c9b0" },
    secondary: { main: "#81c995" },
    background: {
      default: "#121916",
      paper: "#1d2722",
    },
    text: {
      primary: "#edf5f0",
      secondary: "#b4c4bb",
    },
    divider: "#39483f",
  },
};

export default function createAppTheme(mode="light"){
    return createTheme({
        palette: {
            mode, ...palettes[mode],
            success: {
                main: mode === "dark" ? "#81c9c9" : "#2e7d32",
            },
            warning: {
                main: mode === "dark" ? "#ffca72" : "#ed6c02",
            },
            error: {
                main: mode === "dark" ? "#ff8a80" : "#d32f2f",
            },
            info: {
                main: mode === "dark" ? "#82b1ff" : "#0288d1",
            }
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
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
            body: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            },
            }),
        },
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

    })
}



// const theme = createTheme({
//     palette: {
//         mode: "light",

//         primary: {
//             main: "#14967f",
//         },

//         secondary: {
//             main: "#0d6e39",
//         },

//         background: {
//             default: "#f4f7f4",
//         },
//     },

//     shape: {
//         borderRadius: 10,
//     },

//     typography: {
//         h4: {
//             fontWeight: 700,
//         },

//         h5: {
//             fontWeight: 650,
//         },

//         h6: {
//             fontWeight: 650,
//         },

//         subtitle1: {
//             fontWeight: 600,
//         },
//     },

//     components: {
//         MuiAccordion: {
//             styleOverrides: {
//                 root: {
//                     border: "1px solid",
//                     borderColor: "divider",
//                     borderRadius: 8,
//                     boxShadow: "none",

//                     "&:before": {
//                         display: "none",
//                     },

//                     "&:first-of-type": {
//                         borderRadius: 8,
//                     },

//                     "&:last-of-type": {
//                         borderRadius: 8,
//                     },
//                 },
//             },
//         },

//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     textTransform: "none",
//                     borderRadius: 10,
//                     // fontWeight: 600,
//                     padding: "8px 16px",
//                 },
//             },
//         },
//         MuiCard : {
//             styleOverrides: {
//                 root: {
//                     width: "100%",
//                     borderRadius: 15,
//                     transition: "0.2s",
//                      "&:hover": {
//                         boxShadow: 2,
//                         transform: "translateY(-2px)",
//                         },
//                 }
//             }
//         }
//     },
// });

// export default theme;