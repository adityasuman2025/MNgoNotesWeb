import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FullScreenLoader from "mngo-project-tools/comps/FullScreenLoader";
import { EXTENSION_ENV_NAME, EXTENSION_ENV_VAL } from './constants';
import { createMemoryHistory } from "history";
const history = createMemoryHistory(); // to make router work in chrome extension, ref: https://stackoverflow.com/a/69195607

// lazy loading split the main bundle into many parts
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Home = lazy(() => import('./pages/Home'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

function Routes() {
    useEffect(() => {
        if (process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL) { // if build is for chrome's extension then setting dimn of the popup UI
            document.body.style.minHeight = "600px"; // max allowed height for chrome's extension is 600px
            document.body.style.minWidth = "550px"; // max allowed width for chrome's extension is 800px
        }
    }, []);

    return (
        <BrowserRouter history={history}>
            <Suspense fallback={<FullScreenLoader styles={{ className: "fullScreenLoaderBckgrnd", loaderClassName: "loader" }} />}>
                <Switch>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/privacy-policy" component={PrivacyPolicy} />

                    <Route path="*" component={LoginPage} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    )
}

export default Routes;