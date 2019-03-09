import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  Linking,
  TouchableOpacity
} from 'react-native';

import Back from '../../shared/Back/Back';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';

import api from '../../shared/api';

import schools from './schools';
import Dropdown from '../../shared/Dropdown/Dropdown';

export default class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    school: '',
    schoolField: '',
    schoolFocused: false
  };

  onChangeText = key => input => this.setState({ [key]: input });

  onSchoolChange = input => this.setState({ schoolField: input });

  onSchoolPress = item => this.setState({ school: item, schoolField: item });

  toggleSchoolModal = () => this.setState({schoolFocused: !this.state.schoolFocused});

  register = () => {
    api(
      {
        path: 'auth/register',
        method: 'POST',
        body: this.state
      },
      (err, res) => {
        if (err && !res.jwt) return Alert.alert(err);
        AsyncStorage.setItem('jwt', res.jwt);
        return this.props.navigation.navigate('Topics', { jwt: res.jwt });
      }
    );
  }

  render() {
    const {
      firstName,
      lastName,
      school,
      email,
      password,
      password2,
      schoolField,
      schoolFocused
    } = this.state;
    const { animationPresets } = this.props;

    return (
      <View style={styles.register}>
        <View style={styles.headingContainer}>
          <Back onPress={animationPresets.Landing} />
          <Text style={styles.heading}>Kayıt Ol</Text>
        </View>
        <View style={styles.halfInputs}>
          <Input
            onChangeText={this.onChangeText('firstName')}
            type="firstName"
            placeholder="Ad"
            width="45%"
            value={firstName}
          />
          <Input
            onChangeText={this.onChangeText('lastName')}
            type="lastName"
            placeholder="Soyad"
            width="45%"
            value={lastName}
          />
        </View>
        <TouchableOpacity
          style={styles.schoolInputInterceptor}
          onPress={this.toggleSchoolModal}
        >
          <View pointerEvents="none">
            <Input
              value={school}
              editable={false}
              onPress={this.toggleSchoolModal}
              placeholder="Okul"
              onChangeText={this.onSchoolChange}
            />
          </View>
        </TouchableOpacity>
        <Dropdown
          field={schoolField}
          data={schools}
          focused={schoolFocused}
          placeholder="Okul"
          onChange={this.onSchoolChange}
          onPress={this.onSchoolPress}
          toggle={this.toggleSchoolModal}
        />
        <Input
          onChangeText={this.onChangeText('email')}
          type="email"
          placeholder="E-posta"
          value={email}
        />
        <Input
          onChangeText={this.onChangeText('password')}
          type="password"
          placeholder="Şifre"
          value={password}
        />
        <Input
          onChangeText={this.onChangeText('password2')}
          type="password"
          placeholder="Şifre Doğrulama"
          value={password2}
        />
        <Button
          text="Kayıt Ol"
          onPress={this.register}
        />
        <View style={styles.agrements}>
          <Text>Bu butona basarak</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.getbloom.info/web/privacy-policy')}>
            <Text style={styles.agreementLink}> Gizlilik Sözleşmesi'ni </Text>
          </TouchableOpacity>
          <Text>ve</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.getbloom.info/web/terms')}>
            <Text style={styles.agreementLink}> Kullanım Şartları'nı </Text>
          </TouchableOpacity>
          <Text>kabul etmiş olursunuz.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  schoolInputInterceptor: { width: '100%' },
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
  },
  agrements: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    justifyContent: 'center'
  },
  agreementLink: { color: '#16425B' }
});
