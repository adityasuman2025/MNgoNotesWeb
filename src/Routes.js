import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "mngo-project-tools/dist/style.css";

//lazy loading split the main bundle into many parts
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Home = lazy(() => import('./pages/Home'));
const ViewNote = lazy(() => import('./pages/ViewNote'));
const CreateNote = lazy(() => import('./pages/CreateNote'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Routes = () => (
    <BrowserRouter >
        <Suspense fallback={
            <div className="routeLoading">loading</div>
        }>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />

                <Route exact path="/home" component={Home} />
                <Route exact path="/view-note/:encrypted_notes_id" component={ViewNote} />
                <Route exact path="/create-note" component={CreateNote} />

                <Route path="*" component={NotFound} />
            </Switch>
        </Suspense>
    </BrowserRouter>
);

export default Routes;