import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import Back from '../../shared/Back/Back';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';

export default class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    school: ''
  };

  onChangeText = (key) => {
    return (input) => this.setState({[key]: input});
  }

  render() {
    return (
      <View style={styles.register}>
        <View style={styles.headingContainer}>
          <Back animationPresets={this.props.animationPresets} />
          <Text style={styles.heading}>Kayıt Ol</Text>
        </View>
        <View style={styles.halfInputs}>
          <Input 
            onChangeText={this.onChangeText('firstName')} 
            type="firstName"
            placeholder="Ad"
            width="45%"
            value={this.state.firstName}
          />
          <Input 
            onChangeText={this.onChangeText('lastName')} 
            type="lastName"
            placeholder="Soyad"
            width="45%"
            value={this.state.lastName}
          />
        </View>
        <Input 
          onChangeText={this.onChangeText('school')} 
          placeholder="Okul"
          value={this.state.school}
        />
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
          text="Kayıt Ol" 
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  register: {
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
  },
  back: {
    width: 20,
    height: 20,
    marginRight: 'auto',
    marginTop: 5
  },
  halfInputs: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});