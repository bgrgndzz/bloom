import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  Alert,
  AsyncStorage
} from 'react-native';

import Back from '../../shared/Back/Back';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';

import loginPOST from './api/login';

export default class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  onChangeText = (key) => {
    return (input) => this.setState({[key]: input});
  }

  login = () => loginPOST(this.state, (err, jwt) => {
    if (err && !jwt) return Alert.alert(err);
    AsyncStorage.setItem('jwt', jwt);
    this.props.changePage('Main');
  });

  render() {
    return (
      <View style={styles.login}>
        <View style={styles.headingContainer}>
          <Back animationPresets={this.props.animationPresets} />
          <Text style={styles.heading}>Giriş Yap</Text>
        </View>
        <Input 
          onChangeText={this.onChangeText('email')} 
          type='email'
          placeholder='E-posta'
          value={this.state.email}
        />
        <Input 
          onChangeText={this.onChangeText('password')} 
          type='password'
          placeholder='Şifre'
          value={this.state.password}
        />
        <Button 
          text="Giriş Yap" 
          onPress={this.login}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25
  },
  heading: {
    fontSize: 34,
    fontWeight: '900',
    color: '#16425B',
    flex: 1,
    marginLeft: 10
  }
});