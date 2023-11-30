import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
// import { store } from './redux/store';
import GlobalStyle from './components/GlobalStyle';
import { PersistGate } from 'redux-persist/integration/react';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <GlobalStyle>
                <App />
            </GlobalStyle>
        </PersistGate>
    </Provider>
    // </React.StrictMode>
);
