import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Alert
} from 'react-native';

import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

import Header from '../../Header/Header';
import BottomNavigation from '../../BottomNavigation/BottomNavigation';

import api from '../../../../shared/api';

export default Page = BaseComponent => {
  return class Page extends Component {
    state = {
      notifications: 0,
      messages: 0
    };

    logout = async () => {
      const jwt = await AsyncStorage.getItem('jwt');
      const notificationToken = await AsyncStorage.getItem('notificationToken');
      if (jwt) await AsyncStorage.removeItem('jwt');
      if (notificationToken) await AsyncStorage.removeItem('notificationToken');
      api(
        {
          path: 'notificationToken/unregister',
          method: 'POST',
          body: { notificationToken },
          jwt
        },
        (err, res) => this.props.navigation.navigate('Landing')
      );
    }

    countNotifications = () => {
      api(
        {
          path: 'notifications/count',
          method: 'GET',
          jwt: this.props.screenProps.jwt,
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }
          return this.setState({ notifications: res.notifications });
        }
      );
    }

    countMessages = () => {
      api(
        {
          path: 'messages/count',
          method: 'GET',
          jwt: this.props.screenProps.jwt,
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }
          return this.setState({ messages: res.messages });
        }
      );
    }

    componentDidMount() {
      this.countNotifications();
      this.countMessages();
    }

    render() {
      return (
        <View style={styles.container}>
          <StatusBarPaddingIOS style={styles.statusBar} />
          <Header
            navigation={this.props.navigation}
            notifications={this.state.notifications}
            {...this.props}
          />
          <View style={styles.content}>
            <BaseComponent
              {...this.props}
              logout={this.logout}
            />
          </View>
          <BottomNavigation
            logout={this.logout}
            messages={this.state.messages}
            {...this.props}
          />
        </View>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  content: {
    flex: 1
  },
  statusBar: {
    backgroundColor: '#16425B'
  }
});
