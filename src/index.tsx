import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@aws-amplify/ui-react';
import './styles.css';
import '@aws-amplify/ui-react/styles.css';

const theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      font: {
        primary: { value: '#000000' },
        // ...
      },
    },
    components: {
      button: {
        // this will affect the font weight of all button variants
        fontWeight: { value: '{fontWeights.regular}' },
        // style the primary variation
        primary: {
          backgroundColor: { value: '#1ed760' },
          _hover: {
            backgroundColor: { value: '{colors.blue.80}' },
          },
          _focus: {
            backgroundColor: { value: '#167347' },
          },
        },
      },
      tabs: {
        borderColor: { value: '#ffffff' },
        item: {
          color: { value: '#000000' },
          fontSize: { value: '{fontSizes.xl}' },
          fontWeight: { value: '{fontWeights.bold}' },
          _hover: {
            color: { value: '{colors.black.10}' },
          },
          _focus: {
            color: { value: '#167347' },
          },
          _active: {
            color: { value: '#188754' },
            borderColor: { value: '#167347' },
            backgroundColor: { value: '{colors.green.10}' },
          },
          _disabled: {
            color: { value: 'gray' },
            backgroundColor: { value: 'transparent' },
          },
        },
      },
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
