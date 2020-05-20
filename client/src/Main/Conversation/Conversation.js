import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Dimensions
} from 'react-native';

import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { CachedImage } from 'react-native-cached-image';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import defaultprofile from '../../images/defaultprofile.png';

import Input from '../../shared/Input/Input';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

const messagePlaceholders = [
  'Selam nasılsın canım falan de',
  'Hızınız 150',
  'Ortamcıları kimse sevmez',
  'Burası tinder değil bu arada',
  'Kafa birine benziyo',
  'İyi arkadaş olursunuz',
  'Bi şansını dene',
  'Meyve suyu içmeye davet et',
  'Kankalık teklif et'
];

const translateDate = date => date
  .replace('a few seconds ago', 'şimdi')
  .replace('seconds ago', ' sn')
  .replace('a minute ago', '1 dk')
  .replace('minutes ago', 'dk')
  .replace('an hour ago', '1 sa')
  .replace('hours ago', 'sa')
  .replace('a day ago', '1 gün')
  .replace('days ago', 'gün')
  .replace('a month ago', '1 ay')
  .replace('months ago', 'ay')
  .replace('a year ago', '1 yıl')
  .replace('years ago', 'yıl');

export default class Conversation extends Component {
  state = {
    messages: [],
    otherUser: {},
    page: 1,
    refreshing: false,
    dataEnd: false,
    dataLoading: false,
    message: '',
    keyboardOpen: false
  }

  listMessages = (state = {}) => {
    const { jwt } = this.props.screenProps;
    const user = this.props.navigation.getParam('user', '');
    const { page, messages } = this.state;

    api(
      {
        path: `messages/conversation/${user}/${page}`,
        method: 'GET',
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          ...state,
          messages: messages.concat(res.messages),
          otherUser: res.otherUser,
          dataEnd: res.messages.length < 10,
          dataLoading: false
        });
      }
    );
  }

  sendMessage = () => {
    const { message } = this.state;
    const otherUser = this.state.otherUser._id;
    const { logout } = this.props;
    const { jwt } = this.props.screenProps;
    api(
      {
        path: `messages/send/${otherUser}`,
        method: 'POST',
        body: { message },
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return logout();
          return Alert.alert(err);
        }

        return this.setState({ message: '' });
      }
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      messages: [],
      page: 1
    }, () => {
      this.listMessages({ refreshing: false });
    });
  }

  onChangeMessage = message => this.setState({ message });

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({
      keyboardOpen: true
    }));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({
      keyboardOpen: false
    }));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.screenProps.socket.removeListener('new message');
    this.props.screenProps.socket.removeListener('seen message');
    this.props.screenProps.socket.removeListener('online user');
    this.props.screenProps.socket.removeListener('offline user');
  }

  componentDidMount() {
    this.messagePlaceholder = messagePlaceholders[Math.floor(Math.random() * messagePlaceholders.length)];
    this.props.screenProps.socket.on('new message', message => {
      this.onRefresh();
    });
    this.props.screenProps.socket.on('seen message', messages => {
      let stateMessages = [...this.state.messages];

      messages.forEach(message => {
        const stateIndex = stateMessages.findIndex(stateMessage => stateMessage._id === message);
        if (stateIndex !== -1) {
          stateMessages[stateIndex].seen = true;
        }
      });

      this.setState({ messages: stateMessages });
    });

    this.props.screenProps.socket.on('online user', user => {
      if (user === this.state.otherUser._id) {
        this.setState({
          otherUser: {
            ...this.state.otherUser,
            online: true
          }
        });
      }
    });

    this.props.screenProps.socket.on('offline user', user => {
      if (user === this.state.otherUser._id) {
        this.setState({
          otherUser: {
            ...this.state.otherUser,
            online: false
          }
        });
      }
    });

    this.onRefresh();
  }

  render() {
    const { messages, otherUser, refreshing, page, dataEnd, dataLoading, message, keyboardOpen } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {otherUser.user && (
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.otherUserInfo}
              onPress={
                () => {
                  navigation.push('Profile', {
                    user: otherUser._id === jwtDecode(this.props.screenProps.jwt).user ? null : otherUser._id,
                    jwt: this.props.screenProps.jwt
                  });
                }
              }
            >
              <CachedImage
                style={styles.profilepicture}
                source={otherUser.user.profilepicture ?
                  { uri: `https://www.bloomapp.xyz/uploads/profilepictures/${otherUser.user.profilepicture}` } :
                  defaultprofile
                }
              />
              <Text style={styles.name}>
                {otherUser.user.firstName} {otherUser.user.lastName}
              </Text>
              {this.state.otherUser.online && <View style={styles.onlineCircle} />}
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          inverted
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.message, styles[item.type]]}>
              <View style={styles.messageContent}>
                <Text style={styles[`${item.type}Text`]}>{item.message}</Text>
              </View>
              <Text style={styles.messageFooter}>
                {item.type === 'sent' && (
                  <FontAwesome
                    icon="check"
                    style={[styles.sentCheck, styles[item.seen ? 'seen' : 'unseen']]}
                  />
                )} <Text style={[styles.messageDate, styles[`${item.type}Date`]]}>{translateDate(moment(item.date).fromNow())}</Text>
              </Text>
            </View>
          )}
          onScroll={e => {
            const event = e.nativeEvent;
            const currentOffset = event.contentOffset.y;
            const heightLimit = event.contentSize.height - event.layoutMeasurement.height * 1.25;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= heightLimit &&
              !dataLoading &&
              !dataEnd &&
              this.direction === 'down' &&
              this.offset > 0
            ) {
              this.setState({
                dataLoading: true,
                page: page + 1
              }, this.listMessages);
            }
          }}
          ListHeaderComponent={(
            <React.Fragment>
              <View style={styles.chatFooter}>
                <View style={styles.chatForm}>
                  <Input
                    placeholder={this.messagePlaceholder}
                    multiline
                    onChangeText={this.onChangeMessage}
                    value={message}
                    containerStyle={styles.input}
                  />
                  {!keyboardOpen && (
                    <TouchableOpacity
                      style={styles.sendButtonContainer}
                      onPress={this.sendMessage}
                    >
                      <FontAwesome
                        icon="paperPlane"
                        style={styles.sendButton}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <KeyboardSpacer topSpacing={-50} />
            </React.Fragment>
          )}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={dataLoading}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  messages: {
    flex: 1
  },
  messagesContent: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  message: {
    backgroundColor: 'white',
    padding: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    maxWidth: Dimensions.get('window').width * 0.8
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#4E9DEA',
    borderBottomRightRadius: 0
  },
  received: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0
  },
  sentText: {
    color: 'white'
  },
  messageContent: {
    marginBottom: 10
  },
  messageFooter: {
    fontSize: 12,
    justifyContent: 'flex-end'
  },
  sentCheck: {
    fontSize: 10
  },
  seen: {
    color: 'white'
  },
  unseen: {
    color: 'rgba(0, 0, 0, 0.5)'
  },
  sentDate: {
    color: 'rgba(0, 0, 0, 0.5)'
  },
  receivedUnseen: {
    color: 'rgba(0, 0, 0, 0.25)'
  },
  receivedDate: {
    color: 'rgba(0, 0, 0, 0.25)'
  },
  loading: {
    marginBottom: 15
  },
  input: {
    marginBottom: 15,
    flex: 1
  },
  chatForm: {
    flex: 1,
    flexDirection: 'row'
  },
  sendButtonContainer: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  sendButton: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1
  },
  chatHeader: {
    backgroundColor: '#0F2F42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 10
  },
  otherUserInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
    color: '#f7f7f7'
  },
  onlineCircle: {
    backgroundColor: '#53DD6C',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10
  }
});
