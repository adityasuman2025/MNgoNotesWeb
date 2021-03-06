import React, { Suspense, lazy } from 'react';
// import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import Home from './pages/Home';
// import ViewNote from './pages/ViewNote';
// import CreateNote from './pages/CreateNote';
// import NotFound from './pages/NotFound';

//lazy loading split the main bundle into many parts
import LoadingAnimation from "./components/LoadingAnimation";

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
            <div className="routeLoading">
                <LoadingAnimation loading />
            </div>
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