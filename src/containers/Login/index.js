import React, { Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faInfoCircle } from '@fortawesome/fontawesome-free-solid';

// Utils
import { Auth } from '../../utils';

// Components
import { ProviderSelect, Loader } from '../../components';

import './styles.scss';

library.add(faUserCircle, faInfoCircle);

class LoginComponent extends Component{
  constructor(props) {
    super(props);
    this.webid = React.createRef();
    this.state = {
      idp: '',
      loading: false
    };
  }
  renderProviderInput(): React.Element {
    return (this.state.idp !== '' && this.state.idp === false &&
    <input placeholder="Enter WebId" type="text" ref={ this.webid } className="input-solid-webid"/>);
  }
  render(){
    return (
      <div className="app-login">
        <div className="app-login-container">
          <FontAwesomeIcon icon="user-circle" className="profile-icon" />
          <h1>Profile Demo App</h1>
          <div className="app-container-provider">
            <p>Login with Solid Identity</p>
            <ProviderSelect {...{
              placeholder: 'Select Id provider',
              options: Auth.getIdentityProviders(),
              onChange: this.onProviderSelect,
              components: true
            }} />
            { this.renderProviderInput() }
            <button type="button" onClick={ this.goLogin } className="btn">Go</button>
            <div className="register-container">
              <p>Don&rsquo;t have a Solid Identity?</p>
              <button type="button" onClick={ this.goLogin } className="btn">Register</button>
            </div>
            <a href="https://solid.mit.edu/" rel="noopener noreferrer" target="_blank" className="link">
              <FontAwesomeIcon icon="info-circle" />What is a Solid Identity?
            </a>
          </div>
        </div>
        <Loader show={ this.state.loading } />
      </div>
    );
  }

  onProviderSelect = ($event) => {
    this.setState({ idp: $event.value || false });
  }

  goLogin = async() => {
    let idp = this.state.idp;
    this.setState({ loading: true });
    if (this.webid.current.value !== '') {
      idp = this.webid.current.value;
    }
    await Auth.solidLogin(idp);
    this.setState({ loading: false });
  }
}

export default LoginComponent;