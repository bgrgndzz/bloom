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

import defaultprofile from '../../../images/defaultprofile.png';

import Badge from '../Badge/Badge';

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

export default class Comment extends Component {
  render() {
    return (
      <View style={styles.comment}>
        <View style={styles.top}>
          {
            this.props.anonymous ?
              (
                <View style={styles.authorContainer}>
                  <CachedImage
                    style={styles.profilepicture}
                    source={defaultprofile}
                  />
                  <Text style={styles.author}>Anonim</Text>
                </View>
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
                  {this.props.author.mainBadge ? (
                    <Badge
                      badge={this.props.author.mainBadge}
                      size="small"
                    />
                  ) : null}
                </TouchableOpacity>
              )
          }
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
          </View>
        </View>
        <View style={styles.main}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  comment: {
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
  main: {
    width: '100%',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    color: '#505050',
    marginRight: 5
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
  date: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '300',
    fontSize: 12
  },
  highlighted: {
    color: '#16425B'
  }
});
