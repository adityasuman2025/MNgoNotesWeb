import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Home from './pages/Home';
import ViewNote from './pages/ViewNote';
import CreateNote from './pages/CreateNote';

import NotFound from './pages/NotFound';

const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />

            <Route exact path="/home" component={Home} />
            <Route exact path="/view-note/:encrypted_notes_id" component={ViewNote} />
            <Route exact path="/create-note" component={CreateNote} />

            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;