import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "mngo-project-tools/dist/style.css";
import { EXTENSION_ENV_NAME, EXTENSION_ENV_VAL } from './constants';
import { createMemoryHistory } from "history";
const history = createMemoryHistory(); // to make router work in chrome extension, ref: https://stackoverflow.com/a/69195607

//lazy loading split the main bundle into many parts
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Home = lazy(() => import('./pages/Home'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

function Routes() {
    useEffect(() => {
        if (process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL) {
            document.body.style.minHeight = "300px";
            document.body.style.minWidth = "550px"; //if build is for chrome's extension then setting min-width to body
        }
    }, []);

    return (
        <BrowserRouter history={history}>
            <Suspense fallback={<div className="routeLoading">loading</div>}>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
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