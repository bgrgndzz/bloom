import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  Linking,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';

import Back from '../../shared/Back/Back';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';

import api from '../../shared/api';

import cities from './cities';
import schools from './schools';
import Dropdown from '../../shared/Dropdown/Dropdown';

export default class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    city: '',
    cityField: '',
    school: '',
    schoolField: '',
    referrerCode: '',
    schoolFocused: false,
    cityFocused: false,
    registerDisabled: false,
    innerPreset: '1'
  };

  onChangeText = key => input => this.setState({ [key]: input });

  onSchoolChange = input => this.setState({ schoolField: input });

  onSchoolPress = item => this.setState({ school: item, schoolField: item });

  toggleSchoolModal = () => this.setState({ schoolFocused: !this.state.schoolFocused });

  onCityChange = input => this.setState({ cityField: input });

  onCityPress = item => this.setState({ city: item, cityField: item });

  toggleCityModal = () => this.setState({ cityFocused: !this.state.cityFocused });

  register = () => {
    this.setState({
      registerDisabled: true
    }, () => {
      api(
        {
          path: 'auth/register',
          method: 'POST',
          body: this.state
        },
        (err, res) => {
          if ((!res || !res.jwt) && err) {
            return this.setState({
              registerDisabled: false
            }, () => Alert.alert(err));
          }

          if (res.error) {
            return this.setState({
              registerDisabled: false
            }, () => Alert.alert(res.error));
          }
          AsyncStorage.setItem('jwt', res.jwt);
          this.props.screenProps.setJWT(res.jwt);

          AsyncStorage
            .getItem('onboarding')
            .then(onboarding => {
              if (!onboarding) {
                AsyncStorage.setItem('onboarding', JSON.stringify({}));
              }

              return this.props.navigation.navigate('Topics');
            });
        }
      );
    });
  }

  componentWillMount() {
    this.innerAnimatedState = {
      firstOpacity: new Animated.Value(1),
      secondOpacity: new Animated.Value(0)
    };
    this.innerAnimationPresets = {
      '1': () => {
        this.setState(prevState => ({ innerPreset: `${prevState.innerPreset}1` }), () => {
          Animated.timing(
            this.innerAnimatedState.firstOpacity,
            {
              toValue: 1,
              duration: 125,
              delay: 125,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.timing(
            this.innerAnimatedState.secondOpacity,
            {
              toValue: 0,
              duration: 125,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start(() => {
            this.setState({ innerPreset: '1' });
          });
        });
      },
      '2': () => {
        this.setState(prevState => ({ innerPreset: `${prevState.innerPreset}2` }), () => {
          Animated.timing(
            this.innerAnimatedState.secondOpacity,
            {
              toValue: 1,
              duration: 125,
              delay: 125,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.timing(
            this.innerAnimatedState.firstOpacity,
            {
              toValue: 0,
              duration: 125,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start(() => {
            this.setState({ innerPreset: '2' });
          });
        });
      }
    };
  }

  render() {
    const {
      firstName,
      lastName,
      city,
      school,
      email,
      password,
      password2,
      schoolField,
      schoolFocused,
      cityField,
      cityFocused,
      referrerCode,
      registerDisabled,
      innerPreset
    } = this.state;
    const { animationPresets } = this.props;
    const {
      firstOpacity,
      secondOpacity
    } = this.innerAnimatedState;

    return (
      <View style={styles.register}>
        {innerPreset.includes('1') && (
          <Animated.View
            style={[
              styles.register1,
              { opacity: firstOpacity }
            ]}
          >
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
              onPress={this.toggleCityModal}
            >
              <View pointerEvents="none">
                <Input
                  value={city}
                  editable={false}
                  onPress={this.toggleCityModal}
                  placeholder="Şehir"
                  onChangeText={this.onCityChange}
                />
              </View>
            </TouchableOpacity>
            <Dropdown
              field={cityField}
              data={cities}
              focused={cityFocused}
              placeholder="City"
              onChange={this.onCityChange}
              onPress={this.onCityPress}
              toggle={this.toggleCityModal}
            />
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
              data={schools[city]}
              focused={schoolFocused}
              placeholder="Okul"
              onChange={this.onSchoolChange}
              onPress={this.onSchoolPress}
              toggle={this.toggleSchoolModal}
            />
            <Input
              onChangeText={this.onChangeText('referrerCode')}
              type="referrerCode"
              placeholder="Davet Kodu (İsteğe Bağlı)"
              value={referrerCode}
            />
            <Button
              text="Devam Et"
              disabled={registerDisabled}
              onPress={this.innerAnimationPresets['2']}
            />
          </Animated.View>
        )}
        {innerPreset.includes('2') && (
          <Animated.View
            style={[
              styles.register2,
              { opacity: secondOpacity }
            ]}
          >
            <View style={styles.headingContainer}>
              <Back onPress={this.innerAnimationPresets['1']} />
              <Text style={styles.heading}>Kayıt Ol</Text>
            </View>
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
              disabled={registerDisabled}
              onPress={this.register}
            />
            <View style={styles.agrements}>
              <Text>Bu butona basarak</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.bloomapp.xyz/web/privacy-policy')}>
                <Text style={styles.agreementLink}> Gizlilik Sözleşmesi'ni </Text>
              </TouchableOpacity>
              <Text>ve</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.bloomapp.xyz/web/terms')}>
                <Text style={styles.agreementLink}> Kullanım Şartları'nı </Text>
              </TouchableOpacity>
              <Text>kabul etmiş olursunuz.</Text>
            </View>
          </Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  schoolInputInterceptor: { width: '100%' },
  register: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  register1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
  },
  register2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
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
