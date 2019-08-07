import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  AsyncStorage,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import Tooltip from 'react-native-walkthrough-tooltip';

import Post from '../shared/Post/Post';
import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import DoubleSelect from '../shared/DoubleSelect/DoubleSelect';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';
import Dropdown from '../../shared/Dropdown/Dropdown';

import api from '../../shared/api';

const transformPostInput = post => post.replace(/\[mention: \((.*?)\)\((.*?)\)\]/gi, '@$2');

export default class Topic extends Component {
  state = {
    posts: [],
    users: [],
    sort: 'popular',
    post: '',
    mentionField: '',
    refreshing: false,
    anonymous: false,
    mentionFocused: false,
    postTopicOnboarding: false
  }

  toggleMentionModal = () => this.setState({ mentionFocused: !this.state.mentionFocused });

  onMentionChange = input => this.setState({ mentionField: input });

  onMentionPress = item => {
    lastAt = this.state.post.lastIndexOf('@');
    post = this.state.post.substring(0, lastAt) + `[mention: (${item._id})(${item.name})]`;

    this.setState({ mentionField: item.name, post });
  }

  loadUsers = () => {
    api(
      {
        path: 'users/list',
        method: 'GET',
        jwt: this.props.screenProps.jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({ users: res.users });
      }
    )
  }

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      api(
        {
          path: `posts/list/${this.props.navigation.getParam('topic', '')}/${this.state.sort}`,
          method: 'GET',
          jwt: this.props.screenProps.jwt
        },
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
    api(
      {
        path: `posts/create/${this.props.navigation.getParam('topic', '')}`,
        method: 'POST',
        jwt: this.props.screenProps.jwt,
        body: {
          text: this.state.post,
          anonymous: this.state.anonymous
        }
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

  onChangeText = post => {
    const mentionRegex = /\[mention: \((.*?)\)\((.*?)\)\]/i;
    const mentionRegexGlobal = /\[mention: \((.*?)\)\((.*?)\)\]/gi;
    const mentions = post.match(/@([^\s]+)/gi);
    const originalMentions = this.state.post.match(mentionRegexGlobal);

    if (mentions && originalMentions) {
      originalMentions.forEach(mention => {
        const name = mention.match(mentionRegex)[2];
        post = post.replace(new RegExp(`@${name}`, 'gi'), mention);
      });
    }

    this.setState({ post });

    if (post[post.length - 1] === '@') this.toggleMentionModal();
  }

  sort = sort => {
    this.setState({ sort }, this.onRefresh);
  }

  reportCallback = this.onRefresh;

  componentDidMount = () => {
    this.onRefresh();
    this.loadUsers();
    this.onboarding = {};
    AsyncStorage
      .getItem('onboarding')
      .then(onboarding => {
        if (onboarding) this.onboarding = JSON.parse(onboarding);
        if (this.onboarding.postTopic) {
          this.setState({ postTopicOnboarding: true });
        } else {
          this.onboarding.postTopic = true;
          AsyncStorage.setItem('onboarding', JSON.stringify(this.onboarding));
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.posts}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          refreshControl={(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          )}
        >
          <View style={styles.topicContainer}>
            <View style={styles.topic}>
              <Text style={styles.topicName}>{this.props.navigation.getParam('topic', '')}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <Tooltip
              animated
              isVisible={!this.state.postTopicOnboarding}
              content={<Text style={styles.tooltipContent}>Bu konu hakkındaki fikrini yaz ve yaşıtlarınla paylaş!</Text>}
              placement="top"
              tooltipStyle={styles.tooltip}
              onClose={() => this.setState({ postTopicOnboarding: true })}
              onChildPress={() => this.setState({ postTopicOnboarding: true })}
            >
              <Input
                placeholder="Fikrini paylaş"
                multiline
                onChangeText={this.onChangeText}
                value={transformPostInput(this.state.post)}
                containerStyle={{marginBottom: 15}}
              />
            </Tooltip>
            <Dropdown
              field={this.state.mentionField}
              data={this.state.users}
              searchKey="name"
              placeholder="Kişi"
              focused={this.state.mentionFocused}
              onChange={this.onMentionChange}
              onPress={this.onMentionPress}
              toggle={this.toggleMentionModal}
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState({anonymous: !this.state.anonymous})}
            >
              <View style={[styles.checkbox, this.state.anonymous ? styles.checkboxActive : styles.checkboxInactive]}>
                {this.state.anonymous && (
                  <FontAwesome
                    style={styles.checkboxIcon}
                    icon="check"
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>Anonim</Text>
            </TouchableOpacity>
            <Button
              text="Paylaş"
              onPress={this.onPress}
            />
          </View>
          <DoubleSelect
            options={{
              popular: 'Popüler',
              new: 'Yeni'
            }}
            option={this.state.sort}
            onChangeOption={this.sort}
          />
          {this.state.posts.map(post => (
            <Post
              key={post._id}
              {...post}
              {...this.props}
              include={['user']}
              navigation={this.props.navigation}
              logout={this.props.logout}
              reportCallback={this.reportCallback}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  posts: {
    flex: 1
  },
  postsContent: {
    marginTop: 15,
    paddingBottom: 15
  },
  topicContainer: {
    elevation: 2
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
    shadowOffset: { width: 0, height: 0 },
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
  },
  tooltip: {
    width: '50%',
    marginTop: -15
  },
  tooltipContent: {
    textAlign: 'center'
  }
});
