import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import { CachedImage } from 'react-native-cached-image';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

import defaultprofile from '../../../images/defaultprofile.png';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';
import api from '../../../shared/api';

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

export default class Post extends Component {
  state = {
    liked: this.props.liked,
    likes: this.props.likes,
    disabled: false
  }

  transformPost = post => {
    const mentionRegex = /\[mention: \((.*?)\)\((.*?)\)\]/i;
    const mentionRegexGlobal = /\[mention: \((.*?)\)\((.*?)\)\]/gi;
    const mentionRegexUngrouped = /\[mention: \(.*?\)\(.*?\)\]/gi;
    const mentions = post.match(mentionRegexGlobal);

    if (mentions) {
      post = post.split(mentionRegexUngrouped).map((splitText, index, array) => {
        let id;
        let name;

        if (index !== array.length - 1) {
          const mentionArgs = mentions[index].match(mentionRegex);
          [, id, name] = mentionArgs;
        }

        return [
          (
            <Text
              style={styles.normal}
              key="normal"
            >
              {splitText}
            </Text>
          ),
          index === array.length - 1 ? null : (
            <Text
              style={styles.highlighted}
              key="higlighted"
              onPress={() => this.props.navigation.push('Profile', {
                user: id === jwtDecode(this.props.screenProps.jwt).user ? null : id,
                jwt: this.props.screenProps.jwt
              })}
            >
              @{name}
            </Text>
          )
        ];
      });
    }

    return post;
  }

  like = () => {
    this.setState({ disabled: true }, () => {
      api(
        {
          path: `post/${this.state.liked ? 'unlike' : 'like'}/${this.props._id}`,
          method: 'POST',
          jwt: this.props.screenProps.jwt,
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }

          return this.setState({
            liked: res.liked,
            likes: res.likes,
            disabled: false
          });
        }
      );
    });
  }

  report = () => {
    this.setState({ disabled: true }, () => {
      api(
        {
          path: `post/report/${this.props._id}`,
          method: 'POST',
          jwt: this.props.screenProps.jwt,
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }

          Alert.alert('Şikayetiniz alındı');
          return this.setState({ disabled: false });
        }
      );
    });
  }

  render() {
    return (
      <View style={styles.post}>
        {this.props.include.includes('user') && (
          <View style={styles.top}>
            {
              this.props.anonymous ?
                (
                  <TouchableOpacity
                    style={styles.authorContainer}
                    onPress={() => {}}
                  >
                    <CachedImage
                      style={styles.profilepicture}
                      source={defaultprofile}
                    />
                    <Text style={styles.author}>Anonim</Text>
                  </TouchableOpacity>
                ) :
                (
                  <TouchableOpacity
                    style={styles.authorContainer}
                    onPress={
                      () => {
                        this.props.navigation.push('Profile', {
                          user: this.props.author._id === jwtDecode(this.props.screenProps.jwt).user ? null : this.props.author._id,
                          jwt: this.props.screenProps.jwt
                        });
                      }
                    }
                  >
                    <CachedImage
                      style={styles.profilepicture}
                      source={this.props.author.profilepicture ?
                        { uri: `https://www.getbloom.info/uploads/profilepictures/${this.props.author.profilepicture}` } :
                        defaultprofile
                      }
                    />
                    <Text style={styles.author}>
                      {this.props.author.firstName} {this.props.author.lastName}
                    </Text>
                  </TouchableOpacity>
                )
            }
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
            </View>
          </View>
        )}
        <View style={styles.main}>
          {this.props.include.includes('topic') && (
            <TouchableOpacity
              style={styles.topicContainer}
              onPress={() => this.props.navigation.push('Topic', {
                topic: this.props.topic,
                jwt: this.props.screenProps.jwt
              })}
            >
              <Text style={styles.topic}>{this.props.topic}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.text}>{this.transformPost(this.props.text)}</Text>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.likesContainer}
            onPress={this.like}
            disabled={this.state.disabled}
          >
            <FontAwesome
              style={this.state.liked ? styles.likeIconActive : styles.likeIconInactive}
              icon="heart"
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Likes', {
                post: this.props._id,
                jwt: this.props.screenProps.jwt
              })}
            >
              <Text style={styles.likes}>{this.state.likes.length} beğeni</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reportContainer}
            onPress={this.report}
            disabled={this.state.disabled}
          >
            <FontAwesome
              style={styles.reportIcon}
              icon="exclamation"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  top: {
    width: '100%',
    padding: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    backgroundColor: '#fcfcfc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottom: {
    width: '100%',
    padding: 15,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    backgroundColor: '#fcfcfc',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    padding: 15
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  author: {
    fontWeight: '700',
    color: '#505050'
  },
  topic: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.75)'
  },
  text: {
    fontWeight: '100'
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeIconActive: {
    color: '#EA3546',
    marginRight: 5
  },
  likeIconInactive: {
    color: '#CBD5DE',
    marginRight: 5
  },
  reportContainer: {
    marginLeft: 'auto'
  },
  reportIcon: {
    color: '#CBD5DE'
  },
  likes: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontWeight: '100'
  },
  date: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '300',
    fontSize: 12
  },
  highlighted: {
    color: '#16425B'
  }
});
