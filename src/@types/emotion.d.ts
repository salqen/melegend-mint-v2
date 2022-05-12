import "@emotion/react";

import type { Theme as MuiTheme } from "@mui/system";

export interface Options extends MuiTheme {}

declare module "@emotion/react" {
  // eslint-disable-next-line
  export interface Theme extends Options {}
}

declare module "@mui/material/styles" {
  // eslint-disable-next-line
  export interface Theme extends Options {}
}
