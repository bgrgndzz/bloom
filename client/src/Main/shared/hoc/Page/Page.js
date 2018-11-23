import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

import Header from '../../Header/Header.js';
import BottomNavigation from '../../BottomNavigation/BottomNavigation.js';

export default Page = (BaseComponent) => {
  return class extends Component {
    logout = async () => {
      const jwt = await AsyncStorage.getItem('jwt');
      if (jwt) await AsyncStorage.removeItem('jwt');
      this.props.navigation.navigate('Landing');
    }

    render() {
      return (
        <View style={styles.container}>
          <StatusBarPaddingIOS style={{backgroundColor: '#16425B'}} />
          <Header 
            navigation={this.props.navigation}
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