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
    page: '',
    jwt: ''
  }

  componentWillMount = () => {
    AsyncStorage.getItem('jwt').then(jwt => {
      if (jwt) {
        this.setState({
          page: 'Main',
          jwt
        });
      } else {
        this.setState({page: 'Landing'});
      }
    });
  }

  changePage = (page, state={}) => {
    this.setState({
      ...state,
      page
    });
  }

  render() {
    let props = {
      changePage: this.changePage
    };
    if (this.state.jwt) {
      props.jwt = this.state.jwt;
    }
  
    const Page = pages[this.state.page];
    return this.state.page ? <Page {...props} /> : null;
  }
}