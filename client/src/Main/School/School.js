import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import jwtDecode from 'jwt-decode';

import Post from '../shared/Post/Post';
import DoubleSelect from '../shared/DoubleSelect/DoubleSelect';
import User from '../shared/User/User';

import api from '../../shared/api';

const SchoolInformation = props => (
  <React.Fragment>
    <View style={styles.school}>
      <Text style={styles.name}>{props.school}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{props.postCount}</Text>
          <Text style={styles.statName}>Paylaşım</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{props.userCount}</Text>
          <Text style={styles.statName}>Kullanıcı</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{props.likeCount}</Text>
          <Text style={styles.statName}>Beğeni</Text>
        </View>
      </View>
    </View>
    <DoubleSelect
      options={{
        users: 'Kullanıcılar',
        posts: 'Paylaşımlar'
      }}
      option={props.option}
      onChangeOption={props.onChangeOption}
    />
  </React.Fragment>
);

export default class School extends Component {
  state = {
    users: [],
    posts: [],
    postCount: 0,
    likeCount: 0,
    refreshing: false,
    page: 1,
    dataEnd: false,
    dataLoading: false,
    option: 'users'
  }

  loadSchool = (state = {}) => {
    api(
      {
        path: `school/${this.props.navigation.getParam('school', '')}/${this.state.page}`,
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
          users: res.users,
          posts: this.state.posts.concat(res.posts),
          postCount: res.postCount,
          likeCount: res.likeCount,
          dataEnd: res.posts.length < 10,
          dataLoading: false
        });
      }
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      users: [],
      posts: [],
      page: 1
    }, () => {
      this.loadSchool({ refreshing: false });
    });
  }

  onChangeOption = option => this.setState({ option });

  componentDidMount = this.onRefresh;

  render() {
    let renderItem;
    let data;

    if (this.state.option === 'users') {
      data = this.state.users;

      renderItem = ({ item }) => (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.push('Profile', {
              user: item._id === jwtDecode(this.props.screenProps.jwt).user ? null : item._id,
              jwt: this.props.screenProps.jwt
            });
          }}
        >
          <User
            user={item}
            search={this.state.search}
          />
        </TouchableOpacity>
      );
    } else if (this.state.option === 'posts') {
      data = this.state.posts;
      renderItem = ({ item }) => (
        <Post
          {...item}
          {...this.props}
          include={['user', 'topic']}
          navigation={this.props.navigation}
          logout={this.props.logout}
        />
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.posts}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onScroll={e => {
            if (this.state.option === 'posts') {
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
                }, this.loadSchool);
              }
            }
          }}
          ListHeaderComponent={(
            <SchoolInformation
              jwt={this.props.screenProps.jwt}
              school={this.props.navigation.getParam('school', '')}
              userCount={this.state.users.length}
              likeCount={this.state.likeCount}
              postCount={this.state.postCount}
              option={this.state.option}
              onChangeOption={this.onChangeOption}
            />
          )}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={this.state.dataLoading}
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
  posts: {
    flex: 1
  },
  postsContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  school: {
    backgroundColor: 'white',
    marginBottom: 10,
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
  name: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.75)'
  },
  about: { fontWeight: '400' },
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
  loading: {
    marginBottom: 15
  }
});
