import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';
import moment from 'moment';
import jwt_decode from 'jwt-decode';

const translateDate = (date) => {
  date = date.replace('a few seconds ago', 'şimdi');
  date = date.replace('seconds ago', ' sn');

  date = date.replace('a minute ago', '1 dk');
  date = date.replace('minutes ago', 'dk');

  date = date.replace('an hour ago', '1 sa');
  date = date.replace('hours ago', 'sa');

  date = date.replace('a day ago', '1 gün');
  date = date.replace('days ago', 'gün');

  date = date.replace('a month ago', '1 ay');
  date = date.replace('months ago', 'ay');

  date = date.replace('a year ago', '1 yıl');
  date = date.replace('years ago', 'yıl');

  return date;
}

export default class Notification extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.notification}
        onPress={
          () => {
            if (this.props.type === 'like') {
              this.props.navigation.push('Topic', {
                topic: this.props.topic,
                jwt: this.props.navigation.getParam('jwt', '')
              });
            } else if (this.props.type === 'follow') {
              this.props.navigation.push('Profile', {
                user: this.props.from._id === jwt_decode(this.props.navigation.getParam('jwt', '')).user ? null : this.props.from._id,
                jwt: this.props.navigation.getParam('jwt', '')
              })
            }
          }
        }
      >
        {
          this.props.seen ? null : (
            <View style={styles.new}></View>
          )
        }
        <TouchableOpacity
          style={styles.fromContainer}
          onPress={
            () => {
              this.props.navigation.push('Profile', {
                user: this.props.from._id === jwt_decode(this.props.navigation.getParam('jwt', '')).user ? null : this.props.from._id,
                jwt: this.props.navigation.getParam('jwt', '')
              })
            }
          }
        >
          <CachedImage
            style={styles.profilepicture}
            source={this.props.from.profilepicture ?
              {uri: 'https://www.getbloom.info/uploads/profilepictures/' + this.props.from.profilepicture} :
              require('../../../images/defaultprofile.png')
            }
          />
        </TouchableOpacity>
        {
          this.props.type === 'like' ?
          (
            <Text style={styles.main}><Text style={styles.from}>{this.props.from.firstName} {this.props.from.lastName}</Text> "<Text style={styles.bold}>{this.props.topic}</Text>" başlığındaki bir paylaşımını beğendi. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text></Text>
          ) :
          (
            <Text style={styles.main}><Text style={styles.from}>{this.props.from.firstName} {this.props.from.lastName}</Text> seni takip etmeye başladı. <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text></Text>
          )
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
    shadowOffset: {width: 0, height: 0},
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
    fontWeight: '100',
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
