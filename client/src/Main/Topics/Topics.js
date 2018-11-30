import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import {throttle} from 'throttle-debounce';

import Topic from '../shared/Topic/Topic';
import User from '../shared/User/User';
import DoubleSelect from '../shared/DoubleSelect/DoubleSelect';
import Input from '../../shared/Input/Input';

import listTopics from './api/listTopics';
import search from './api/search';

export default class Topics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      topics: [],
      searchResults: [],
      sort: 'popular',
      searchOption: 'topics',
      optionType: 'sort',
      search: '',
      refreshing: false
    };
    this.listTopicsThrottled = throttle(100, this.listTopics);
    this.searchThrottled = throttle(100, this.search);
  }
  
  listTopics = () => listTopics(this.props.navigation.getParam('jwt', ''), this.state.sort, (err, res) => {
    if (err && !res) {
      if (err === 'unauthenticated') return this.props.logout();
      return Alert.alert(err);
    }
    this.setState({
      topics: res.topics,
      refreshing: false
    });
  });
  search = () => search(this.props.navigation.getParam('jwt', ''), this.state.searchOption, this.state.search, (err, res) => {
    if (err && !res) {
      if (err === 'unauthenticated') return this.props.logout();
      return Alert.alert(err);
    }
    this.setState({
      searchResults: res[this.state.searchOption],
      refreshing: false
    });
  });

  onRefresh = () => {
    this.setState({refreshing: true}, this.state.optionType === 'sort' ? this.listTopicsThrottled : this.searchThrottled);
  }
  onChangeOption = option => {
    this.setState({[this.state.optionType === 'sort' ? 'sort' : 'searchOption']: option}, this.onRefresh);
  }
  onChangeText = search => {
    if (search && search.length > 0) {
      if (this.state.optionType === 'search') {
        this.setState({search}, this.onRefresh);
      } else {
        this.setState({search, optionType: 'search'}, this.onRefresh);
      }
    } else {
      this.setState({search: '', optionType: 'sort'}, this.onRefresh);
    }
  }

  componentDidMount = this.onRefresh;

  render() {
    return (
      <ScrollView 
        style={styles.topics}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <Input 
          placeholder="Kişi veya konu ara"
          value={this.state.search}
          onChangeText={this.onChangeText}
          containerStyle={{marginBottom: 15}}
        />
        <DoubleSelect 
          options={this.state.optionType === 'sort' ? {
            popular: 'Popüler',
            new: 'Yeni'
          } : {
            topics: 'Konular',
            users: 'Kullanıcılar'
          }}
          option={this.state.optionType === 'sort' ? this.state.sort : this.state.searchOption}
          onChangeOption={this.onChangeOption}
        />
        {(() => {
          if (this.state.optionType === 'sort') {
            return this.state.topics.map(topic => (
              <TouchableOpacity 
                key={topic.topic}
                onPress={() => this.props.navigation.push('Topic', {topic: topic.topic, jwt: this.props.navigation.getParam('jwt', ''), back: true})}
              >
                <Topic
                  topic={topic.topic}
                  posts={topic.posts}
                />
              </TouchableOpacity>
            ))
          } else if (this.state.optionType === 'search'){
            if (this.state.searchOption === 'topics') {
              return this.state.searchResults.map(topic => (
                <TouchableOpacity 
                  key={topic.topic}
                  onPress={() => this.props.navigation.push('Topic', {topic: topic.topic, jwt: this.props.navigation.getParam('jwt', ''), back: true})}
                >
                  <Topic
                    topic={topic.topic}
                    posts={topic.posts}
                    search={this.state.search}
                  />
                </TouchableOpacity>
              ))
            } else if (this.state.searchOption === 'users') {
              return this.state.searchResults.map(user => (
                <TouchableOpacity 
                  key={user._id}
                  onPress={() => this.props.navigation.push('Profile', {user: user._id, jwt: this.props.navigation.getParam('jwt', ''), back: true})}
                >
                  <User 
                    user={user} 
                    search={this.state.search}
                  />
                </TouchableOpacity>
              ))
            }
          }
        })()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topics: {
    padding: 15
  }
});