import React from 'react';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Shared Components
import { PrivateRoute } from './components';

// Containers Components
import * as containers from './containers';

export default function Routes() {
  return (
    <Router>
      <App>
        <Route exact path="/" component={ containers.LoginComponent } />
        <PrivateRoute exact path="/card" component={ containers.DashboardComponent } />
        <PrivateRoute exact path="/chat" component={ containers.ChatComponent } />
      </App>
    </Router>);
}