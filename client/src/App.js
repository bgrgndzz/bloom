import React, {Component} from 'react';

import {AsyncStorage} from 'react-native';

import Landing from './Landing/Landing';
import Main from './Main/Main';

const pages = {
  Landing,
  Main
};

export default class App extends Component {
  state = {
    page: 'Landing',
    jwt: ''
  }

  changePage = (page, state={}) => {
    this.setState({
      ...state,
      page
    });
  };

  render() {
    let props = {
      changePage: this.changePage
    };
    if (this.state.jwt) {
      props.jwt = this.state.jwt;
    }

    const Page = pages[this.state.page];
    return <Page {...props} />
  }
}