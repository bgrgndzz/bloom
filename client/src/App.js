import React, {Component} from 'react';

import Landing from './Landing/Landing';

const pages = {
  Landing
};

export default class App extends Component {
  state = {
    page: 'Landing'
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

    const Page = pages[this.state.page];
    return <Page {...props} />
  }
}