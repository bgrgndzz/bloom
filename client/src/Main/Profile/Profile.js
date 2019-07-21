import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native';

import jwtDecode from 'jwt-decode';
import { CachedImage } from 'react-native-cached-image';

import Post from '../shared/Post/Post';
import Button from '../../shared/Button/Button';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';
import Badge from '../shared/Badge/Badge';

import api from '../../shared/api';

const UserInformation = props => (
  <React.Fragment>
    {Object.keys(props.user).length > 0 && (
      <View style={styles.user}>
        {props.userId ? (
          <TouchableOpacity
            style={styles.modalOpenButton}
            onPress={props.openModal}
          >
            <FontAwesome
              style={styles.modalOpenIcon}
              icon="ellipsisV"
            />
          </TouchableOpacity>
        ) : null}
        <CachedImage
          style={styles.profilepicture}
          source={props.user.profilepicture ?
            {uri: 'https://www.getbloom.info/uploads/profilepictures/' + props.user.profilepicture} :
            require('../../../src/images/defaultprofile.png')
          }
        />
        <Text style={styles.name}>{props.user.firstName} {props.user.lastName}</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigationPush('School', {
              school: props.user.school,
              jwt: props.jwt
            });
          }}
        >
          <Text style={styles.school}>{props.user.school}</Text>
        </TouchableOpacity>
        {props.user.mainBadge ? (
          <Badge
            badge={props.user.mainBadge}
            size="big"
          />
        ) : null}
        {props.user.about && (
          <Text style={styles.about}>{props.user.about}</Text>
        )}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{props.user.postCount}</Text>
            <Text style={styles.statName}>Paylaşım</Text>
          </View>
          <TouchableOpacity
            style={styles.stat}
            onPress={() => {
              props.navigationPush('Followers', {
                user: props.userId || jwtDecode(props.jwt).user,
                jwt: props.jwt
              });
            }}
          >
            <Text style={styles.statNumber}>{props.user.followers.length}</Text>
            <Text style={styles.statName}>Takipçi</Text>
          </TouchableOpacity>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{props.user.likeCount}</Text>
            <Text style={styles.statName}>Beğeni</Text>
          </View>
        </View>
        {props.userId ? (
          <Button
            style={styles.followButton}
            onPress={props.follow}
            disabled={props.followDisabled}
            text={props.user.followed ? 'Takipten Çık' : 'Takip Et'}
          />
        ) : null}
      </View>
    )}
  </React.Fragment>
);

export default class Profile extends Component {
  state = {
    user: {},
    refreshing: false,
    followDisabled: false,
    modalOpen: false,
    page: 1,
    dataEnd: false,
    dataLoading: false
  }

  loadUser = (state = {}) => {
    let path = 'user/';
    if (this.props.navigation.getParam('user', '')) {
      path += `${this.props.navigation.getParam('user', '')}/`;
    }
    path += this.state.page;

    api(
      {
        path,
        method: 'GET',
        jwt: this.props.screenProps.jwt,
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          ...state,
          user: res.user,
          posts: this.state.posts.concat(res.posts),
          dataEnd: res.posts.length < 10,
          dataLoading: false
        });
      }
    );
  }

  follow = () => {
    this.setState({ followDisabled: true }, () => {
      api(
        {
          path: `user/${this.state.user.followed ? 'unfollow' : 'follow'}/${this.props.navigation.getParam('user', '')}`,
          method: 'POST',
          jwt: this.props.screenProps.jwt,
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }

          return this.setState({
            user: {
              ...this.state.user,
              followed: res.followed,
              followers: res.followers
            },
            followDisabled: false
          });
        }
      );
    });
  }

  block = () => {
    api(
      {
        path: `user/block/${this.props.navigation.getParam('user', '')}`,
        method: 'POST',
        jwt: this.props.screenProps.jwt,
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.props.navigation.goBack();
      }
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      user: {},
      posts: [],
      page: 1
    }, () => {
      this.loadUser({ refreshing: false });
    });
  }

  openModal = () => this.setState({ modalOpen: true });

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.posts}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={this.state.posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Post
              {...item}
              {...this.props}
              author={this.state.user}
              include={['user', 'topic']}
              navigation={this.props.navigation}
              logout={this.props.logout}
            />
          )}
          onScroll={e => {
            const event = e.nativeEvent;
            const currentOffset = event.contentOffset.y;
            const heightLimit = event.contentSize.height - event.layoutMeasurement.height * 1.25;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= heightLimit &&
              !this.state.dataLoading &&
              !this.state.dataEnd &&
              this.direction === 'down' &&
              this.offset > 0
            ) {
              this.setState({
                dataLoading: true,
                page: this.state.page + 1
              }, this.loadUser);
            }
          }}
          ListHeaderComponent={(
            <UserInformation
              user={this.state.user}
              followDisabled={this.state.followDisabled}
              userId={this.props.navigation.getParam('user', '')}
              jwt={this.props.screenProps.jwt}
              navigationPush={this.props.navigation.push}
              openModal={this.openModal}
              follow={this.follow}
            />
          )}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={this.state.dataLoading}
            />
          )}
        />
        <Modal
          style={styles.settingsModalContainer}
          visible={this.state.modalOpen}
          transparent
        >
          <TouchableOpacity
            style={styles.settingsModalBackdrop}
            onPress={() => this.setState({ modalOpen: false })}
          />
          <View style={styles.settingsModalContent}>
            <TouchableOpacity
              style={styles.settingsModalItem}
              onPress={
                () => {
                  if (this.state.user._id !== jwtDecode(this.props.screenProps.jwt).user) {
                    this.setState(
                      { modalOpen: false },
                      () => this.props.navigation.push('Conversation', {
                        user: this.state.user._id,
                        jwt: this.props.screenProps.jwt
                      })
                    );
                  }
                }
              }
            >
              <Text style={styles.settingsModalText}>Mesaj Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsModalItem}
              onPress={this.block}
            >
              <Text style={styles.settingsModalText}>Engelle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsModalCancel}
              onPress={() => this.setState({ modalOpen: false })}
            >
              <Text style={styles.settingsModalCancelText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  posts: {
    flex: 1
  },
  postsContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  user: {
    backgroundColor: 'white',
    marginBottom: 45,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
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
    marginBottom: 5,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  },
  about: {
    fontWeight: '400',
    marginTop: 10
  },
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
  },
  modalOpenButton: {
    position: 'absolute',
    right: 20,
    top: 20
  },
  modalOpenIcon: {
    color: '#16425B',
    fontSize: 20
  },
  settingsModalBackdrop: {
    flex: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingsModalContent: {
    flex: 2,
    backgroundColor: 'white'
  },
  settingsModalItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  settingsModalText: {
    textAlign: 'center',
    fontSize: 15
  },
  settingsModalCancel: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsModalCancelText: {
    color: '#EA3546',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center'
  },
  loading: {
    marginBottom: 15
  }
});
