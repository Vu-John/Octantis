import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

// Containers
import HomePage from '../containers/home/index.jsx';
import NotFound from '../containers/notfound/index.jsx';
import TableExamplePage from '../containers/table/index.jsx';

// Components
import FrameComponent from '../components/frame/index.jsx';


const RenderComponent = (Component) => {
    return (
        <FrameComponent Component={Component} />
    )
}

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" render={() => (
                <Redirect to="/home" />
            )} />
            <Route path="/home" render={props => RenderComponent(HomePage)} />
            <Route path="/table" render={props => RenderComponent(TableExamplePage)} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes;
