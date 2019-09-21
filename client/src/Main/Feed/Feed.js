import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from 'react-native';

import { CachedImage } from 'react-native-cached-image';

import Post from '../shared/Post/Post';

import api from '../../shared/api';

import defaultprofile from '../../images/defaultprofile.png';

export default class Feed extends Component {
  state = {
    posts: [],
    ad: {},
    page: 1,
    refreshing: false,
    dataEnd: false,
    dataLoading: false
  }

  listFeedPosts = (state = {}) => {
    const { jwt } = this.props.screenProps;
    const { page, posts } = this.state;
    api(
      {
        path: `posts/list/feed/${page}`,
        method: 'GET',
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({
          ...state,
          posts: posts.concat(res.posts),
          ad: (res.ad && Object.keys(res.ad).length > 0) ? res.ad : {},
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
      ad: {},
      posts: [],
      page: 1
    }, () => {
      this.listFeedPosts({ refreshing: false });
    });
  }

  reportCallback = this.onRefresh;

  componentWillMount = this.onRefresh;

  render() {
    const { posts, refreshing, page, dataEnd, dataLoading } = this.state;
    const { navigation, logout } = this.props;

    const renderItem = ({ item, index }) => {
      if (index === 3 && Object.keys(this.state.ad).length > 0) {
        return (
          <TouchableOpacity onPress={() => Linking.openURL(`https://www.getbloom.info/ad/${this.state.ad._id}/${jwtDecode(this.props.screenProps.jwt).user}?ref=feed`)}>
            <View style={styles.adPost}>
              <View style={styles.adTop}>
                <View style={styles.adAuthorContainer}>
                  <CachedImage
                    style={styles.adProfilepicture}
                    source={defaultprofile}
                  />
                  <Text style={styles.adAuthor}>{this.state.ad.company}</Text>
                </View>
              </View>
              <View style={styles.adMain}>
                <TouchableOpacity
                  style={styles.adTopicContainer}
                  onPress={() => Linking.openURL(`https://www.getbloom.info/ad/${this.state.ad._id}/${jwtDecode(this.props.screenProps.jwt).user}?ref=feed`)}
                >
                  <Text style={styles.adTopic}>{this.state.ad.topic}</Text>
                </TouchableOpacity>
                <Text style={styles.adText}>{this.state.ad.text}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }

      return (
        <Post
          {...item}
          {...this.props}
          include={['user', 'topic']}
          navigation={navigation}
          logout={logout}
          reportCallback={this.reportCallback}
        />
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.posts}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onScroll={e => {
            const event = e.nativeEvent;
            const currentOffset = event.contentOffset.y;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= event.contentSize.height - event.layoutMeasurement.height * 1.25 &&
              !dataLoading &&
              !dataEnd &&
              this.direction === 'down' &&
              this.offset > 0
            ) {
              this.setState({
                dataLoading: true,
                page: page + 1
              }, this.listFeedPosts);
            }
          }}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={dataLoading}
            />
          )}
        />
        {posts.length === 0 && !refreshing && (
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
  },
  loading: {
    marginBottom: 15
  },
  adPost: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  adMain: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ffdddd',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  adTopic: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5
  },
  adText: {
    fontWeight: '100'
  },
  adTop: {
    width: '100%',
    padding: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    backgroundColor: '#ffdddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  adProfilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  adAuthor: {
    fontWeight: '700',
    color: '#505050',
    marginRight: 5
  }
});
