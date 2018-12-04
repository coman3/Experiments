import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';
import '../node_modules/semantic-ui-css/semantic.min.css';
import './styles/styles.scss';
/**
 * Output development version into console
 */
if (process.env.NODE_ENV === "development") {
    console.warn("!------------ Development Version ------------!")
    console.warn("Version: " + process.env.VERSION + " (Development)");
    console.warn("!---------------------------------------------!")
} else {
    // tslint:disable-next-line:no-console
    console.log("Version: " + process.env.VERSION + " (Production)")
}

/**
 * Render the app
 */
function renderApp() {
    const rootEl = document.getElementById('root');

    // go ahead and render the app
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>,
        rootEl
    );

    const anyModule: any = module;

    // Hot Module Replacement API
    if (anyModule.hot) {
        anyModule.hot.accept('./app', () => {
            const makeNextApp = require('./app').default;
            const nextApp = makeNextApp(['app']);

            ReactDOM.render(
                <AppContainer>
                    {nextApp.App}
                </AppContainer>,
                rootEl
            );
        });
    }
}
renderApp();
