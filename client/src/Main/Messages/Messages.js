import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { CachedImage } from 'react-native-cached-image';

import defaultprofile from '../../images/defaultprofile.png';

import Input from '../../shared/Input/Input';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

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

export default class Messages extends Component {
  state = {
    conversations: [],
    page: 1,
    refreshing: false,
    dataEnd: false,
    dataLoading: false,
    search: ''
  }

  listConversations = (state = {}) => {
    const { jwt } = this.props.screenProps;
    const { page, conversations } = this.state;

    api(
      {
        path: `messages/conversations/${page}`,
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
          conversations: conversations.concat(res.conversations),
          dataEnd: res.conversations.length < 10,
          dataLoading: false
        });
      }
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      conversations: [],
      page: 1
    }, () => {
      this.listConversations({ refreshing: false });
    });
  }

  onChangeSearch = search => this.setState({ search });

  componentDidMount = this.onRefresh;

  render() {
    const { conversations, refreshing, page, dataEnd, dataLoading, search } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.conversations}
          contentContainerStyle={styles.conversationsContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          data={search ? conversations.filter(conversation => `${conversation.otherUser.user.firstName} ${conversation.otherUser.user.lastName}`
            .replace('İ', 'i').toLowerCase()
            .indexOf(
              search.replace('İ', 'i').toLowerCase()
            ) > -1) : conversations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversation}
              onPress={
                () => {
                  if (item.otherUser._id !== jwtDecode(this.props.screenProps.jwt).user) {
                    navigation.push('Conversation', {
                      user: item.otherUser._id,
                      jwt: this.props.screenProps.jwt
                    });
                  }
                }
              }
            >
              { item.unseen > 0 && <View style={styles.new} /> }
              <TouchableOpacity
                style={styles.profilepictureContainer}
                onPress={
                  () => {
                    navigation.push('Profile', {
                      user: item.otherUser._id === jwtDecode(this.props.screenProps.jwt).user ? null : item.otherUser._id,
                      jwt: this.props.screenProps.jwt
                    });
                  }
                }
              >
                <CachedImage
                  style={styles.profilepicture}
                  source={item.otherUser.user.profilepicture ?
                    { uri: `https://www.getbloom.info/uploads/profilepictures/${item.otherUser.user.profilepicture}` } :
                    defaultprofile
                  }
                />
              </TouchableOpacity>
              <View style={styles.conversationInfo}>
                <TouchableOpacity
                  style={styles.userNameContainer}
                  onPress={
                    () => {
                      navigation.push('Profile', {
                        user: item.otherUser._id === jwtDecode(this.props.screenProps.jwt).user ? null : item.otherUser._id,
                        jwt: this.props.screenProps.jwt
                      });
                    }
                  }
                >
                  <Text style={styles.userName}>
                    {item.otherUser.user.firstName} {item.otherUser.user.lastName}
                  </Text>
                  <Text style={styles.date}>{translateDate(moment(item.date).fromNow())}</Text>
                </TouchableOpacity>
                <Text
                  style={styles.messagePreview}
                  numberOfLines={1}
                >
                  {item.type === 'sent' && (
                    <FontAwesome
                      icon="check"
                      style={[styles.sentCheck, (item.seen ? styles.seen : styles.unseen)]}
                    />
                  )} {item.message}
                </Text>
              </View>
            </TouchableOpacity>
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
              }, this.listConversations);
            }
          }}
          ListHeaderComponent={(
            <Input
              placeholder="Kişi veya konu ara"
              value={search}
              onChangeText={this.onChangeSearch}
              containerStyle={styles.input}
            />
          )}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={dataLoading}
            />
          )}
        />
        {conversations.length === 0 && !refreshing && (
          <View style={styles.emptyConversationsContainer}>
            <Text style={styles.emptyConversations}>Mesajların burada görünür</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  conversations: {
    flex: 1
  },
  conversationsContent: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  conversation: {
    backgroundColor: 'white',
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    flexDirection: 'row'
  },
  emptyConversationsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyConversations: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  },
  loading: {
    marginBottom: 15
  },
  input: {
    marginBottom: 15
  },
  profilepicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  conversationInfo: {
    flex: 1,
    padding: 5
  },
  userName: {
    fontWeight: '700',
    color: '#505050'
  },
  userNameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontWeight: '300'
  },
  date: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '300',
    fontSize: 12
  },
  new: {
    width: 5,
    height: 5,
    backgroundColor: '#16425B',
    borderRadius: 2.5,
    marginLeft: -12.5,
    marginRight: 3.75,
    marginTop: 25
  },
  sentCheck: {
    fontSize: 10
  },
  unseen: {
    color: 'rgba(0, 0, 0, 0.25)'
  },
  seen: {
    color: '#16425B'
  }
});
