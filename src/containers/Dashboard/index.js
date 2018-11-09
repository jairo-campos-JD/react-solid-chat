import React, { Component} from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './styles.scss';

import NavBar from './components/NavBar';
import ProfileCard from './components/ProfileCard';

class DashboardComponent extends Component{
  render(){
    return (
      <div className="app-login">
        <NavBar />
        <ProfileCard />
        <NotificationContainer />
      </div>
    );
  }
}

export default DashboardComponent;