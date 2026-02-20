import { createGlobalStyle } from "styled-components";
/**
- Font sizes (px)
10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98

Font-weights:

Line-heights:

Letter Spacing:

- Spacing system (px)
2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128

 */

const GlobalStyles = createGlobalStyle`
:root {
  /* Brand color - #2B8A40 */
  --color-brand-0: #eaf3ec;
  --color-brand-50: #d5e8d9;
  --color-brand-100: #aad0b3;
  --color-brand-200: #80b98c;
  --color-brand-500: #55a166;
  --color-brand-600: #2B8A40;
  --color-brand-700: #226e33;
  --color-brand-800: #1a5326;
  --color-brand-900: #11371a;

  /* Grey */
  --color-grey-50: #f1f1f1;
  --color-grey-75: #e9e9e9;
  --color-grey-100: #e0e0e0;
  --color-grey-200: #c0c0c0;
  --color-grey-300: #a0a0a0;
  --color-grey-400: #808080;
  --color-grey-500: #606060;
  --color-grey-600: #404040;
  --color-grey-700: #303030;
  --color-grey-800: #202020;
  --color-grey-900: #101010;

  /* Color Blue */
  --color-blue-100: #e3f3f6;
  --color-blue-200: #c8e7ed;
  --color-blue-400: #6699A2;
  --color-blue-500: #3E7B86;
  --color-blue-600: #256470;
  --color-blue-700: #12505B;
  --color-blue-800: #023640;

  /* Color Orange */
  --color-orange-100: #f8f1ea;
  --color-orange-200: #f2e3d5;
  --color-orange-400: #FFCE9E;
  --color-orange-500: #DA9D62;
  --color-orange-600: #B77739;
  --color-orange-700: #94561A;
  --color-orange-800: #693401;
  
  /* Color Red */
  --color-red-100: #f8ebea;
  --color-red-200: #f2d8d5;
  --color-red-400: #e5b2ac;
  --color-red-500: #de9e98;
  --color-red-600: #B74539;
  --color-red-700: #94261A;
  --color-red-800: #690B01;

  --backdrop-color: rgba(255, 255, 255, 0.1);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  font-size: 62.5%
}

body {
  font-family: "DM Sans", sans-serif;
  color: var(--color-grey-700);
  min-height: 100dvh;
  font-size: 1.6rem;
  line-height: 1.5;
  transition: color 0.3s, background-color 0.3s;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}


a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;
}

// media queries


@media (max-width: 59em) {
  html {
    font-size: 55%;
  }
}
@media (max-width: 34em) {
  html {
    font-size: 40%;
  }
}
`;

export default GlobalStyles;
