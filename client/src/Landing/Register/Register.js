import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  Linking,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';

import Back from '../../shared/Back/Back';
import Button from '../../shared/Button/Button';
import Input from '../../shared/Input/Input';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

import schools from './schools';

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

  onSelect = key => (index, input) => this.setState({ [key]: input });

  onSchoolChange = input => this.setState({ schoolField: input });

  openSchoolModal = () => this.setState({ schoolFocused: true });

  closeSchoolModal = () => this.setState({ schoolFocused: false });

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
          onPress={this.openSchoolModal}
        >
          <View pointerEvents="none">
            <Input
              value={school}
              editable={false}
              onPress={this.openSchoolModal}
              placeholder="Okul"
              onChangeText={this.onSchoolChange}
              ref="schoolInput"
            />
          </View>
        </TouchableOpacity>
        <Modal
          visible={schoolFocused}
          onRequestClose={this.closeSchoolModal}
          animationType="slide"
        >
          <View style={styles.schoolModal}>
            <FlatList
              style={styles.schools}
              contentContainerStyle={styles.schoolsContent}
              showsVerticalScrollIndicator={false}
              data={schoolField ? schools.filter(schoolOption => schoolOption
                .replace('İ', 'i').toLowerCase()
                .indexOf(
                  schoolField.replace('İ', 'i').toLowerCase()
                ) > -1) : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.school}
                  onPress={() => this.setState({ school: item, schoolField: item })}
                >
                  <Text style={styles.schoolName}>{item}</Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={(
                <View style={styles.modalHeading}>
                  <Input
                    containerStyle={styles.modalInputContainer}
                    clearButtonMode="while-editing"
                    value={schoolField}
                    placeholder="Okul"
                    onChangeText={this.onSchoolChange}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.schoolSubmitButton}
                    onPress={this.closeSchoolModal}
                  >
                    <FontAwesome
                      style={styles.schoolSubmitIcon}
                      icon="check"
                    />
                  </TouchableOpacity>
                </View>
              )}
              stickyHeaderIndices={[0]}
            />
          </View>
        </Modal>
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
  agreementLink: { color: '#16425B' },
  schoolInputInterceptor: { width: '100%' },
  schoolModal: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  modalHeading: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 0
  },
  modalInputContainer: { flex: 1 },
  schoolSubmitButton: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  schoolSubmitIcon: {
    fontSize: 20,
    color: '#16425B'
  },
  schools: { flex: 1 },
  schoolsContent: {
    marginTop: -15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  school: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  schoolName: {
    flex: 1,
    color: '#202020',
    fontWeight: '100',
    flexDirection: 'row',
    alignItems: 'center'
  },
});
