import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

import Header from './shared/Header/Header.js';
import BottomNavigation from './shared/BottomNavigation/BottomNavigation.js';

import Feed from './Feed/Feed.js';
import Topics from './Topics/Topics.js';
import Topic from './Topic/Topic.js';
import Profile from './Profile/Profile.js';
import CreateTopic from './CreateTopic/CreateTopic.js';
import Settings from './Settings/Settings.js';
import EditProfile from './EditProfile/EditProfile.js';

const pages = {
  Feed,
  Topics,
  Topic,
  Profile,
  CreateTopic,
  Settings,
  EditProfile
};

export default class Main extends Component {
  state = {
    page: 'Feed',
    loading: false
  }

  changePage = (page, state={}) => {
    if (page === this.state.page) {
      this.setState({
        page: '',
        loading: true
      }, () => {
        this.setState({
          loading: false,
          ...state,
          page
        });
      });
    } else {
      this.setState({
        loading: false,
        ...state,
        page
      });
    }
  }
  goHome = () => {
    AsyncStorage.getItem('jwt').then(jwt => {
      if (jwt) AsyncStorage.removeItem('jwt').then(() => {
        this.props.changePage('Landing');
      });
    });
  }

  render() {
    let props = {
      changePage: this.changePage,
      goHome: this.goHome,
      jwt: this.props.jwt
    };

    if (this.state.page === 'Topic') {
      props.topic = this.state.topic;
    }
    if (this.state.page === 'Profile') {
      props.user = this.state.user;
    }

    const Page = pages[this.state.page];

    return (
      <View style={styles.container}>
        <StatusBarPaddingIOS style={{backgroundColor: '#16425B'}} />
        <Header {...props} />
        <View style={styles.content}>
          {this.state.loading ? <ActivityIndicator /> : <Page {...props} />}
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