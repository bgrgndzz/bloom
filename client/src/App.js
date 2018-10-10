import React, {Component} from 'react';

import Landing from './Landing/Landing';

export default class App extends Component {
  state = {
    page: 'Landing',
    category: '',
    quiz: {}
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

    if (this.state.page === 'Landing') {
      return <Landing {...props} />;
    }
  }
}