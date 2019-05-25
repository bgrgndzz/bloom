import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';

import api from '../shared/api';

export default class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this.redirect();
  }

  redirect = async () => {
    const jwt = await AsyncStorage.getItem('jwt');
    const { navigate } = this.props.navigation;

    if (jwt) {
      this.props.screenProps.socketConnect();

      api(
        {
          path: 'notificationToken/register',
          method: 'POST',
          body: { notificationToken: this.props.screenProps.notificationToken },
          jwt: this.props.screenProps.jwt
        },
        (err, res) => navigate('Topics', { jwt })
      );
    } else {
      api(
        {
          path: 'notificationToken/unregister',
          method: 'POST',
          body: { notificationToken: this.props.screenProps.notificationToken }
        },
        (err, res) => navigate('Landing')
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
