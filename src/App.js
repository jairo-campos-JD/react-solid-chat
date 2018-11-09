import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.scss';

type Props = {
  children: Node,
};

class App extends Component<Props>{
  render(){
    const { children } = this.props;
    return (
      <div>{ children }</div>
    );
  }

  props: Props;
}

export default hot(module)(App);