import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';

import { Auth } from '../../../../utils';
import './styles.scss';

type Props = {
  history: Object
}

class NavBar extends Component<Props> {

  render(){
    return (
      <div className="app-nav-bar pure-g">
        <div className="pure-u-22-24">
          <h3 className="logo">Solid</h3>
        </div>
        <div className="pure-u-2-24 right">
          <button type="button" onClick={ this.signOut }>Sign out</button>
        </div>
      </div>
    );
  }

  signOut = () => {
    if (Auth.solidSignOut()) {
      this.props.history.push('/');
    }
  }

  props: Props;
}

export default withRouter(NavBar);