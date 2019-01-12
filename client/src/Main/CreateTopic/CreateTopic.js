import React, {Component} from 'react';
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
    post: '',
    anonymous: false
  }

  onChangeText = (key) => {
    return (input) => this.setState({[key]: input});
  }
  onPress = () => {
    api(
      {
        path: 'posts/create/' + this.state.topic,
        method: 'POST',
        jwt: this.props.navigation.getParam('jwt', ''),
        body: {
          text: this.state.post,
          anonymous: this.state.anonymous
        }
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        
        this.props.navigation.navigate('Topic', {topic: this.state.topic, jwt: this.props.navigation.getParam('jwt', '')});
      }
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
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
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState({anonymous: !this.state.anonymous})}
            >
              <View style={[styles.checkbox, this.state.anonymous ? styles.checkboxActive : styles.checkboxInactive]}>
                {this.state.anonymous &&
                  <FontAwesome 
                    style={styles.checkboxIcon}
                    icon="check"
                  />
                }
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
  checkboxActive: {
    backgroundColor: '#16425B',
  },
  checkboxInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  checkboxIcon: {
    color: 'white',
    fontSize: 12.5
  }
});