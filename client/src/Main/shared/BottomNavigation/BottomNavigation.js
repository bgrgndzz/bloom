import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  Image
} from 'react-native';

export default class BottomNavigation extends Component {
  render() {
    return (
      <View style={styles.bottomNavigation}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: '#16425B',
    width: '100%',
    height: 50,
    marginTop: 'auto'
  }
});