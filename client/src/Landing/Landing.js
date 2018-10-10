import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';

import Button from '../shared/Button/Button';

export default class Landing extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <View style={styles.logoBox}>
            <Image 
              style={styles.logomark}
              source={require('../images/logomark.png')}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.buttons}>
          <Button 
            style={styles.button}
            text="Kayıt ol"
          />
          <Text style={styles.login}>Hesabın var mı? Giriş yap.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    backgroundColor: '#16425B',
    height: Dimensions.get('window').height * 0.75,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logomark: {
    width: Dimensions.get('window').width * 0.75
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    flex: 1
  },
  login: {
    marginTop: 15,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.9)'
  }
});
