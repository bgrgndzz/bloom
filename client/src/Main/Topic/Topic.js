import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native';

import Post from '../shared/Post/Post';
import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import Sort from '../shared/Sort/Sort';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import listPosts from './api/listPosts';
import createPost from './api/createPost';

export default class Topic extends Component {
  state = {
    posts: [],
    sort: 'popular',
    refreshing: false,
    post: '',
    anonymous: false
  }
  
  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      listPosts(
        this.props.navigation.getParam('jwt', ''), 
        this.props.navigation.getParam('topic', ''),
        this.state.sort,
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }
          this.setState({
            posts: res.posts,
            refreshing: false
          });
        }
      );
    });
  }

  onPress = () => {
    createPost(
      this.props.navigation.getParam('jwt', ''), 
      this.props.navigation.getParam('topic', ''), 
      {
        text: this.state.post,
        anonymous: this.state.anonymous
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({
          sort: 'new',
          post: ''
        }, this.onRefresh);
      }
    );
  }
  sort = (sort) => {
    this.setState({sort}, this.onRefresh);
  }

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.posts}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={styles.topicContainer}>
            <View style={styles.topic}>
              <Text style={styles.topicName}>{this.props.navigation.getParam('topic', '')}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <Input 
              placeholder="Fikrini paylaş"
              multiline={true}
              onChangeText={(post) => this.setState({post})}
              value={this.state.post}
              containerStyle={{marginBottom: 15}}
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState({anonymous: !this.state.anonymous})}
            >
              <View style={[styles.checkbox, this.state.anonymous ? styles.checkboxActive : styles.checkboxInactive]}>
                {this.state.anonymous &&
                  <FontAwesome 
                    style={styles.checkboxIcon}
                    icon="check"
                  />
                }
              </View>
              <Text style={styles.checkboxText}>Anonim</Text>
            </TouchableOpacity>
            <Button 
              text="Paylaş"
              onPress={this.onPress}
            />
          </View>
          <Sort 
            sort={this.state.sort}
            sortFunction={this.sort}
          />
          {this.state.posts.map((post, index) => (
            <Post 
              key={post.id}
              {...post}
              include={['user']}
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
  topic: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1
  },
  topicName: {
    color: '#202020',
    fontWeight: '100',
    textAlign: 'center'
  },
  form: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1
  },
  checkboxContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: {
    backgroundColor: '#16425B',
  },
  checkboxInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  checkboxIcon: {
    color: 'white',
    fontSize: 12.5
  }
});