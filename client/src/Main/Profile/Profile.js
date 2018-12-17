import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';

import Post from '../shared/Post/Post';
import Button from '../../shared/Button/Button';

import getUser from '../shared/api/getUser.js';
import followUser from './api/followUser.js';

export default class Profile extends Component {  
  state = {
    user: {},
    refreshing: false,
    followDisabled: false
  }

  loadUser = (state = {}) => {
    getUser(
      this.props.navigation.getParam('jwt', ''), 
      this.props.navigation.getParam('user', ''),
      (err, res) => {
      if (err && !res) {
        if (err === 'unauthenticated') return this.props.logout();
        return Alert.alert(err);
      }
      this.setState({
        user: res.user,
        ...state
      });
    });
  }
  followUser = () => {
    this.setState({followDisabled: true}, () => {
      followUser(
        this.props.navigation.getParam('jwt', ''), 
        this.props.navigation.getParam('user', ''),
        this.state.user.followed,
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }

          this.setState({
            user: {
              ...this.state.user,
              followed: res.followed,
              followersCount: res.followersCount
            },
            followDisabled: false
          });
        }
      );
    });
  }
  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.loadUser({refreshing: false});
    });
  }

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.posts}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {Object.keys(this.state.user).length > 0 && (
            <View style={styles.user}>
              <CachedImage 
                style={styles.profilepicture}
                source={this.state.user.profilepicture ? 
                  {uri: 'https://www.bloomapp.tk/uploads/profilepictures/' + this.state.user.profilepicture} : 
                  require('../../../src/images/defaultprofile.png')
                }
              />
              <Text style={styles.name}>{this.state.user.firstName} {this.state.user.lastName}</Text>
              <Text style={styles.school}>{this.state.user.school}</Text>
              {this.state.user.about && (
                <Text style={styles.about}>{this.state.user.about}</Text>
              )}
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{this.state.user.postCount}</Text>
                  <Text style={styles.statName}>Paylaşım</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{this.state.user.followersCount}</Text>
                  <Text style={styles.statName}>Takipçi</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{this.state.user.likeCount}</Text>
                  <Text style={styles.statName}>Beğeni</Text>
                </View>
              </View>
              {this.props.navigation.getParam('user', '') ? (
                <Button 
                  style={styles.followButton}
                  onPress={this.followUser}
                  disabled={this.state.followDisabled}
                  text={this.state.user.followed ? 'Takipten Çık' : 'Takip Et'}
                />
              ) : null}
            </View>
          )}
          {Object.keys(this.state.user).length > 0 && this.state.user.posts.map(post => (
            <Post 
              key={post._id}
              {...post}
              author={this.state.user}
              include={['user', 'topic']}
              navigation={this.props.navigation}
              logout={this.props.logout}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  posts: {
    padding: 15
  },
  user: {
    backgroundColor: 'white',
    marginBottom: 45,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
    padding: 15,
    paddingBottom: 30,
    alignItems: 'center'
  },
  profilepicture: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 75
  },
  name: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.75)'
  },
  school: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  },
  about: {fontWeight: '400'},
  backButtonContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12.5
  },
  backButton: {
    width: 12.5,
    height: 12.5
  },
  stats: {
    flexDirection: 'row',
    marginTop: 15
  },
  stat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statNumber: {
    color: '#16425B',
    fontWeight: '900',
    fontSize: 30
  },
  statName: {
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 12,
    marginTop: -5
  },
  followButton: {
    width: '50%',
    position: 'absolute',
    bottom: -20
  }
});