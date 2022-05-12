import createCache from "@emotion/cache";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import React from "react";

export const mui: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7700",
      light: "#ff7700",
      dark: "#ff7700",
    },
    secondary: {
      main: "#1a1a1a",
    },
    background: {
      default: "#1a1a1a",
      paper: "#000000",
    },
    text: {
      primary: "rgba(255,255,255,0.87)",
      secondary: "rgba(255,255,255,0.8)",
      disabled: "rgba(253,253,253,0.38)",
    },
    error: {
      main: "#FF4343",
    },
    success: {
      main: "#00ff29",
    },
    divider: "rgba(47,47,47,0.8)",
    info: {
      main: "#2172E5",
    },
  },
  typography: {
    fontWeightLight: 200,
    fontWeightMedium: 600,

    body1: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "white",
    },
    body2: {
      fontSize: "1.2rem",
      fontWeight: 400,
      color: "white",
    },
    button: {
      fontSize: "1.5rem",
    },
    fontFamily: `"coder", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: "5rem",
      lineHeight: "1.rem",
      textTransform: "uppercase",
    },
    h2: {
      fontWeight: 600,
      fontSize: "4rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "3.5rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "3rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "2.25rem",
    },
  },
  components: {
    MuiList: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "5px",
          // background: "#ffffff",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
      },
    },
  },
};

// Create a theme instance.
const instance = createTheme(mui, {
  white: "#FFFFFF",
  black: "#000000",
});

// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MuiThemeProvider theme={instance}>{children}</MuiThemeProvider>;
}
