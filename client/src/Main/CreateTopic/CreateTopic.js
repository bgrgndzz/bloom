import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

export default class CreateTopic extends Component {
  state = {
    topic: '',
    text: '',
    anonymous: false
  }

  onChangeText = key => input => this.setState({ [key]: input });

  onPress = () => {
    const { topic, text, anonymous } = this.state;
    const { navigation, logout } = this.props;
    const jwt = navigation.getParam('jwt', '');
    api(
      {
        path: `posts/create/${topic}`,
        method: 'POST',
        body: { text, anonymous },
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return logout();
          return Alert.alert(err);
        }

        return navigation.navigate('Topic', { topic, jwt });
      }
    );
  }

  render() {
    const { text, topic, anonymous } = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Bir konu aç</Text>
          <View style={styles.form}>
            <Input
              placeholder="Konu Başlığı"
              onChangeText={this.onChangeText('topic')}
              value={topic}
              containerStyle={styles.input}
            />
            <Input
              placeholder="Senin Fikrin"
              onChangeText={this.onChangeText('text')}
              value={text}
              containerStyle={styles.input}
              multiline
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState(prevState => ({ anonymous: !prevState.anonymous }))}
            >
              <View
                style={[
                  styles.checkbox,
                  anonymous ? styles.checkboxActive : styles.checkboxInactive
                ]}
              >
                {anonymous && (
                  <FontAwesome
                    style={styles.checkboxIcon}
                    icon="check"
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>Anonim</Text>
            </TouchableOpacity>
            <Button
              text="Konu Aç"
              onPress={this.onPress}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 0
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  formHeading: {
    fontSize: 25,
    fontWeight: '900',
    color: '#16425B',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: { marginBottom: 15 },
  checkboxContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: { backgroundColor: '#16425B' },
  checkboxInactive: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  checkboxIcon: {
    color: 'white',
    fontSize: 12.5
  }
});
