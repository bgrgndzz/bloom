import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this._navigate();
  }
  _navigate = async () => {
    const jwt = await AsyncStorage.getItem('jwt');

    if (jwt) {
      this.props.navigation.navigate('Feed', {jwt});
    } else {
      this.props.navigation.navigate('Landing');
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