import React from 'react';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); 
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        
      <CssBaseline/>
          <App/> 
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
