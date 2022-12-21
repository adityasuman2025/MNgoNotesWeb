import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "mngo-project-tools/dist/style.css";

//lazy loading split the main bundle into many parts
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));

const Routes = () => (
    <BrowserRouter >
        <Suspense fallback={<div className="routeLoading">loading</div>}>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />
                <Route exact path="/home" component={Home} />

                <Route path="*" component={NotFound} />
            </Switch>
        </Suspense>
    </BrowserRouter>
);

export default Routes;