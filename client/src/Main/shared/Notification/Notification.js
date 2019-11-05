import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { CachedImage } from 'react-native-cached-image';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

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

export default class Notification extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.notification}
        onPress={
          () => {
            if (
              (
                this.props.type === 'like' ||
                this.props.type === 'comment'
              ) && this.props.post
            ) {
              this.props.navigation.push('Comments', {
                post: this.props.post,
                jwt: this.props.screenProps.jwt
              });
            } else if (
              this.props.type === 'like' ||
              this.props.type === 'mention'
            ) {
              this.props.navigation.push('Topic', {
                topic: this.props.topic,
                jwt: this.props.screenProps.jwt
              });
            } else if (this.props.type === 'follow') {
              this.props.navigation.push('Profile', {
                user: this.props.from._id === jwtDecode(this.props.screenProps.jwt).user ? null : this.props.from._id,
                jwt: this.props.screenProps.jwt
              });
            }
          }
        }
      >
        {
          this.props.seen ? null : (
            <View style={styles.new} />
          )
        }
        <TouchableOpacity
          style={styles.fromContainer}
          onPress={
            () => {
              if (!this.props.anonymous) {
                this.props.navigation.push('Profile', {
                  user: this.props.from._id === jwtDecode(this.props.screenProps.jwt).user ? null : this.props.from._id,
                  jwt: this.props.screenProps.jwt
                });
              }
            }
          }
        >
          <CachedImage
            style={styles.profilepicture}
            source={(this.props.from.profilepicture && !this.props.anonymous) ?
              { uri: 'https://www.getbloom.info/uploads/profilepictures/' + this.props.from.profilepicture } :
              require('../../../images/defaultprofile.png')
            }
          />
        </TouchableOpacity>
        {
          (() => {
            let from;
            if (this.props.anonymous) {
              from = (<Text style={styles.from}>Anonim</Text>);
            } else {
              from = (<Text style={styles.from}>{this.props.from.firstName} {this.props.from.lastName}</Text>);
            }

            if (this.props.type === 'like') {
              return (
                <Text style={styles.main}>
                  {from} "<Text style={styles.bold}>{this.props.topic}</Text>" başlığındaki bir paylaşımını beğendi. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
                </Text>
              );
            }
            if (this.props.type === 'follow') {
              return (
                <Text style={styles.main}>
                  {from} seni takip etmeye başladı. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
                </Text>
              );
            }
            if (this.props.type === 'mention') {
              return (
                <Text style={styles.main}>
                  {from} "<Text style={styles.bold}>{this.props.topic}</Text>" başlığında senden bahsetti. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
                </Text>
              );
            }
            if (this.props.type === 'comment') {
              return (
                <Text style={styles.main}>
                  {from} "<Text style={styles.bold}>{this.props.topic}</Text>" başlığındaki bir paylaşımına yorum yaptı. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
                </Text>
              );
            }
            if (this.props.type === 'bloom') {
              return (
                <Text style={styles.main}>
                  {this.props.text} <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
                </Text>
              );
            }

            return;
          })()
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  fromContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  from: {
    fontWeight: '700',
    color: '#505050'
  },
  bold: {
    fontWeight: '700'
  },
  main: {
    fontWeight: '300',
    flex: 1,
    lineHeight: 30
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
    marginLeft: -8.75,
    marginRight: 3.75,
    marginTop: 12.5
  }
});
