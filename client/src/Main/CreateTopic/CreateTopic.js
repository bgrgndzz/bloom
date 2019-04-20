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
import Dropdown from '../../shared/Dropdown/Dropdown';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

const transformPostInput = post => post.replace(/\[mention: \((.*?)\)\((.*?)\)\]/gi, '@$2');

export default class CreateTopic extends Component {
  state = {
    topic: '',
    text: '',
    anonymous: false,
    users: [],
    mentionField: '',
    refreshing: false,
    anonymous: false,
    mentionFocused: false
  }

  onChangeTopic = topic => this.setState({ topic })

  onChangeText = text => {
    const mentionRegex = /\[mention: \((.*?)\)\((.*?)\)\]/i;
    const mentionRegexGlobal = /\[mention: \((.*?)\)\((.*?)\)\]/gi;
    const mentions = text.match(/@([^\s]+)/gi);
    const originalMentions = this.state.text.match(mentionRegexGlobal);

    if (mentions && originalMentions) {
      originalMentions.forEach(mention => {
        const name = mention.match(mentionRegex)[2];
        text = text.replace(new RegExp(`@${name}`, 'gi'), mention);
      });
    }

    this.setState({ text });

    if (text[text.length - 1] === '@') {
      this.toggleMentionModal();
    }
  }

  toggleMentionModal = () => this.setState({ mentionFocused: !this.state.mentionFocused });

  onMentionChange = input => this.setState({ mentionField: input });

  onMentionPress = item => {
    lastAt = this.state.text.lastIndexOf('@');
    text = this.state.text.substring(0, lastAt) + `[mention: (${item._id})(${item.name})]`;

    this.setState({ mentionField: item.name, text });
  }

  loadUsers = () => {
    api(
      {
        path: 'users/list',
        method: 'GET',
        jwt: this.props.screenProps.jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({ users: res.users });
      }
    );
  }

  onPress = () => {
    const { topic, text, anonymous } = this.state;
    const { navigation, logout } = this.props;
    const { jwt } = this.props.screenProps;
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

  componentDidMount = this.loadUsers;

  render() {
    const { text, topic, anonymous, users, mentionField, mentionFocused } = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Bir konu aç</Text>
          <View style={styles.form}>
            <Input
              placeholder="Konu Başlığı"
              onChangeText={this.onChangeTopic}
              value={topic}
              containerStyle={styles.input}
            />
            <Input
              placeholder="Senin Fikrin"
              onChangeText={this.onChangeText}
              value={transformPostInput(text)}
              containerStyle={styles.input}
              multiline
            />
            <Dropdown
              field={mentionField}
              data={users}
              searchKey="name"
              placeholder="Kişi"
              focused={mentionFocused}
              onChange={this.onMentionChange}
              onPress={this.onMentionPress}
              toggle={this.toggleMentionModal}
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
