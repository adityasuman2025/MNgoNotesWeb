import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import UserDashboard from './pages/UserDashboard';
import UserNote from './pages/UserNote';
import CreateNewNote from './pages/CreateNewNote';

import NotFound from './pages/NotFound';

const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />

            <Route exact path="/dashboard" component={UserDashboard} />
            <Route exact path="/note" component={UserNote} />
            <Route exact path="/create-note" component={CreateNewNote} />            

            <Route path="*" component={ NotFound } />
        </Switch>
    </BrowserRouter>
);

export default Routes;