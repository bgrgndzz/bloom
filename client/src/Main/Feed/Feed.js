import React, {Component} from 'react';
import {
  StyleSheet, 
  FlatList,
  View,
  Text,
  Alert
} from 'react-native';

import Post from '../shared/Post/Post';

import api from '../../shared/api';

export default class Feed extends Component {
  state = {
    posts: [],
    page: 1,
    refreshing: false,
    dataEnd: false
  }

  listFeedPosts = (state = {}) => {
    api(
      {
        path: 'posts/list/feed/' + this.state.page,
        method: 'GET',
        jwt: this.props.navigation.getParam('jwt', ''),
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        
        this.setState({
          ...state,
          posts: this.state.posts.concat(res.posts),
          dataEnd: res.posts.length < 10
        });
      }
    );
  }
  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      posts: [],
      page: 1
    }, () => {
      this.listFeedPosts({refreshing: false});
    });
  }
  nextPage = () => {
    if (!this.state.dataEnd && this.direction === 'down' && this.offset > 0) {
      this.setState({
        page: this.state.page + 1
      }, this.listFeedPosts);
    }
  }

  componentWillMount = this.onRefresh;

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
          extraData={this.state.refreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Post 
              {...item}
              include={['user', 'topic']}
              navigation={this.props.navigation}
              logout={this.props.logout}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={this.nextPage}
          onScroll={(event) => {
            const currentOffset = event.nativeEvent.contentOffset.y;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;
          }}
        />
        {this.state.posts.length === 0 && !this.state.refreshing && (
          <View style={styles.emptyFeedContainer}>
            <Text style={styles.emptyFeed}>Takip ettiklerin burada görünür</Text>
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
  posts: {
    flex: 1
  },
  postsContent: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  emptyFeedContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyFeed: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  }
});