import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { debounce } from 'throttle-debounce';
import jwtDecode from 'jwt-decode';

import Topic from '../shared/Topic/Topic';
import User from '../shared/User/User';
import DoubleSelect from '../shared/DoubleSelect/DoubleSelect';
import Input from '../../shared/Input/Input';

import api from '../../shared/api';

const ListHeader = props => (
  <React.Fragment>
    <Input
      placeholder="Kişi veya konu ara"
      value={props.search}
      onChangeText={props.onChangeText}
      containerStyle={styles.input}
    />
    <DoubleSelect
      options={props.optionType === 'sort' ? {
        popular: 'Popüler',
        new: 'Yeni'
      } : {
        topics: 'Konular',
        users: 'Kullanıcılar'
      }}
      option={props.optionType === 'sort' ? props.sort : props.searchOption}
      onChangeOption={props.onChangeOption}
    />
  </React.Fragment>
);

export default class Topics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      searchResults: [],
      page: 1,
      sort: 'popular',
      searchOption: 'topics',
      optionType: 'sort',
      search: '',
      refreshing: false,
      dataEnd: false,
      dataLoading: false
    };
    this.listTopicsDebounced = debounce(100, this.listTopics);
    this.searchDebounced = debounce(100, this.search);
  }

  listTopics = (state = {}) => {
    api(
      {
        path: `topics/list/${this.state.sort}/${this.state.page}`,
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
          topics: this.state.topics.concat(res.topics),
          dataEnd: res.topics.length < 10,
          dataLoading: false
        });
      }
    );
  }

  search = (state = {}) => {
    api(
      {
        path: `search/${this.state.searchOption}/${this.state.search}`,
        method: 'GET',
        jwt: this.props.screenProps.jwt,
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({
          ...state,
          searchResults: res[this.state.searchOption],
        });
      }
    );
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        dataEnd: false,
        topics: [],
        searchResults: [],
        page: 1
      },
      () => (this.state.optionType === 'sort' ? this.listTopicsDebounced({refreshing: false}) : this.searchDebounced({refreshing: false}))
    );
  }

  onChangeOption = option => {
    this.setState({ [this.state.optionType === 'sort' ? 'sort' : 'searchOption']: option }, this.onRefresh);
  }

  onChangeText = search => {
    if (search && search.length > 0) {
      if (this.state.optionType === 'search') {
        this.setState({ search }, this.onRefresh);
      } else {
        this.setState({ search, optionType: 'search' }, this.onRefresh);
      }
    } else {
      this.setState({ search: '', optionType: 'sort' }, this.onRefresh);
    }
  }

  componentDidMount = this.onRefresh;

  render() {
    let renderItem;
    let data;

    if (this.state.optionType === 'sort') {
      data = this.state.topics;
      renderItem = ({ item }) => (
        <TouchableOpacity
          onPress={() => this.props.navigation.push('Topic', { topic: item.topic, jwt: this.props.screenProps.jwt })}
        >
          <Topic
            topic={item.topic}
            posts={item.posts}
          />
        </TouchableOpacity>
      );
    } else if (this.state.optionType === 'search') {
      if (this.state.searchOption === 'topics') {
        data = this.state.searchResults;
        renderItem = ({ item }) => (
          <TouchableOpacity
            onPress={() => this.props.navigation.push('Topic', { topic: item.topic, jwt: this.props.screenProps.jwt })}
          >
            <Topic
              topic={item.topic}
              posts={item.posts}
              search={this.state.search}
            />
          </TouchableOpacity>
        );
      } else if (this.state.searchOption === 'users') {
        data = this.state.searchResults;
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
      }
    }

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.topics}
          contentContainerStyle={styles.topicsContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onScroll={e => {
            const event = e.nativeEvent;
            const currentOffset = event.contentOffset.y;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= event.contentSize.height - event.layoutMeasurement.height * 1.25 &&
              !this.state.dataLoading &&
              !this.state.dataEnd &&
              this.direction === 'down' &&
              this.offset > 0 &&
              this.state.optionType === 'sort'
            ) {
              this.setState({
                dataLoading: true,
                page: this.state.page + 1
              }, this.listTopicsDebounced);
            }
          }}
          ListHeaderComponent={(
            <ListHeader
              search={this.state.search}
              optionType={this.state.optionType}
              sort={this.state.sort}
              searchOption={this.state.searchOption}
              onChangeOption={this.onChangeOption}
              onChangeText={this.onChangeText}
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
  topics: {
    flex: 1
  },
  topicsContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  loading: {
    marginBottom: 15
  },
  input: {
    marginBottom: 15
  }
});
