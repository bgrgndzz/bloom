import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity
} from 'react-native';

import Button from '../../shared/Button/Button';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.buttons}>
        <Button 
          text="Kayıt ol"
          onPress={this.props.animationPresets['Register']}
        />
        <TouchableOpacity onPress={this.props.animationPresets['Login']}>
          <Text style={styles.login}>Hesabın var mı? Giriş yap.</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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