import React, {Component} from 'react';
import {
  StyleSheet, 
  View
} from 'react-native';

import Header from './shared/Header/Header.js';
import BottomNavigation from './shared/BottomNavigation/BottomNavigation.js';

import Feed from './Feed/Feed.js';
import Topic from './Topic/Topic.js';

const pages = {
  Feed,
  Topic
};

export default class Main extends Component {
  state = {
    page: 'Feed'
  }

  changePage = (page, state={}) => {
    this.setState({
      ...state,
      page
    });
  }
  render() {
    let props = {
      changePage: this.changePage,
      jwt: this.props.jwt
    };

    if (this.state.page === 'Topic') {
      props.topic = this.state.topic;
      props.posts = this.state.posts;
    }

    const Page = pages[this.state.page];

    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Page {...props} />
        </View>
        <BottomNavigation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  content: {
    flex: 1
  }
});