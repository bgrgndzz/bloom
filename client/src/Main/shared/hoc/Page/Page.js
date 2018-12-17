import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  AsyncStorage
} from 'react-native';

import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

import Header from '../../Header/Header.js';
import BottomNavigation from '../../BottomNavigation/BottomNavigation.js';

import countNotifications from '../../api/countNotifications';

export default Page = (BaseComponent) => {
  return class extends Component {
    state = {
      notifications: 0
    }

    logout = async () => {
      const jwt = await AsyncStorage.getItem('jwt');
      if (jwt) await AsyncStorage.removeItem('jwt');
      this.props.navigation.navigate('Landing');
    }

    countNotifications = (state = {}) => {
      countNotifications(
        this.props.navigation.getParam('jwt', ''),
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }
          this.setState({
            ...state,
            notifications: res.notifications
          });
        }
      );
    }

    componentWillMount = this.countNotifications;

    render() {
      return (
        <View style={styles.container}>
          <StatusBarPaddingIOS style={{backgroundColor: '#16425B'}} />
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
  }
});