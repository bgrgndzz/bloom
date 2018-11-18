import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';

import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';

import createTopic from './api/createTopic';

export default class Feed extends Component {
  state = {
    topic: '',
    post: ''
  }

  onChangeText = (key) => {
    return (input) => this.setState({[key]: input});
  }
  onPress = () => {
    createTopic(
      this.props.jwt, 
      this.state.topic, 
      {text: this.state.post},
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.goHome();
          return Alert.alert(err);
        }

        this.props.changePage('Topic', {topic: this.state.topic});
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Bir konu aç</Text>
          <View style={styles.form}>
            <Input 
              placeholder="Konu Başlığı"
              onChangeText={this.onChangeText('topic')}
              value={this.state.topic}
              containerStyle={styles.input}
            />
            <Input 
              placeholder="Senin Fikrin"
              multiline={true}
              onChangeText={this.onChangeText('post')}
              value={this.state.post}
              containerStyle={styles.input}
            />
            <Button 
              text="Konu Aç"
              onPress={this.onPress}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
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
  input: {marginBottom: 15},
});