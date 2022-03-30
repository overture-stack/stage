/// <reference types="@emotion/react/types/css-prop" />

import '@emotion/react';
import { DMSThemeInterface } from '.';

declare module '@emotion/react' {
  export interface Theme extends DMSThemeInterface {}
}
