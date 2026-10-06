
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useMediaQuery, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import createAppTheme from "../theme";

const ThemeModeContext = createContext(null);

function readStorageMode() {
    try {
        const storedMode = localStorage.getItem("themeMode")
        return storedMode == "light" || storedMode == "dark" ? storedMode : null
    } catch {
        return null
    }
}

function saveStorageMode(mode) {
    try {
        localStorage.setItem("themeMode", mode);
    } catch {

    }
}

export function ThemeModeProvider({ children }) {
    const systemPrefersDark = useMediaQuery(
        "(prefers-color-scheme: dark)"
    );

    //   const [mode, setMode] = useState(() => readStorageMode() ?? (systemPrefersDark ? "dark" : "light"))
    const [mode, setMode] = useState(() => {
        const storedMode = readStorageMode()
        if (storedMode) { 
            return storedMode
        }
        return systemPrefersDark ? "dark" : "light";
    })

    const toggleMode = useCallback(() => {
        setMode((current) => {
            const newMode = current === "light" ? "dark" : "light"
            saveStorageMode(newMode)
            return newMode;
        })
    }, [])

    const theme = useMemo(() => createAppTheme(mode), [mode])

    const contextValues = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode])

    return (
        <ThemeModeContext.Provider value={contextValues}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeModeContext);
    if (!context) {
        throw new Error(
            "useThemeMode must be used inside ThemeModeProvider"
        );
    }
    return context;
}