import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  Image
} from 'react-native';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <Image 
          style={styles.logo}
          source={require('../../../images/logo.png')}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#16425B',
    width: '100%',
    height: 70,
    paddingTop: 25
  },
  logo: {
    height: 35,
    marginLeft: 7.5,
    width: 'auto'
  }
});