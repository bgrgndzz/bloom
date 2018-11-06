import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  AsyncStorage
} from 'react-native';

import Header from './shared/Header/Header.js';
import BottomNavigation from './shared/BottomNavigation/BottomNavigation.js';

import Feed from './Feed/Feed.js';
import Topic from './Topic/Topic.js';
import Profile from './Profile/Profile.js';

const pages = {
  Feed,
  Topic,
  Profile
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
  goHome = () => {
    AsyncStorage.getItem('jwt').then(jwt => {
      if (jwt) AsyncStorage.removeItem('jwt').then(() => {
        this.props.changePage('Landing');
      });
    })
    
  }

  render() {
    let props = {
      changePage: this.changePage,
      goHome: this.goHome,
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
        <BottomNavigation 
          {...props}
          pages={pages}
          page={this.state.page}
        />
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