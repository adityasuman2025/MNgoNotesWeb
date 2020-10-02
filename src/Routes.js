import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './pages/NotFound';

const Routes = () => (
<BrowserRouter >
    <Switch>
        {/* <Route exact path="/" component={ LandingPage } /> */}

        <Route path="*" component={ NotFound } />
    </Switch>
</BrowserRouter>
);

export default Routes;