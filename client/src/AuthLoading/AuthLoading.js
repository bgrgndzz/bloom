import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';

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
      navigate('Topics', { jwt });
    } else {
      navigate('Landing');
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
