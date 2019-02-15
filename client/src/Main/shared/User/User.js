import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';

const highlight = (string, search) => {
  return string && string.split(new RegExp(search, 'gi')).map((splitName, index, array) => [
    (
      <Text
        style={styles.normal}
        key="normal"
      >
        {splitName}
      </Text>
    ),
    index === array.length - 1 ? null : (
      <Text
        style={styles.highlighted}
        key="higlighted"
      >
        {string.match(new RegExp(search, 'gi'))[index]}
      </Text>
    )
  ]);
};

export default class User extends Component {
  render() {
    return (this.props.user && this.props.user.user) ? (
      <View style={styles.user}>
        {this.props.user.user.profilepicture ? (
          <CachedImage
            style={styles.profilepicture}
            source={{uri: 'https://www.getbloom.info/uploads/profilepictures/' + this.props.user.user.profilepicture}}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={styles.profilepicture}
            source={require('../../../images/defaultprofile.png')}
            resizeMode="contain"
          />
        )}

        <Text style={styles.name}>
          {
            this.props.search ?
            highlight(`${this.props.user.user.firstName} ${this.props.user.user.lastName}`, this.props.search) :
            `${this.props.user.user.firstName} ${this.props.user.user.lastName}`
          }
        </Text>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  user: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    flexDirection: 'row'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  name: {
    flex: 1,
    color: '#202020',
    fontWeight: '100',
    lineHeight: 30
  },
  highlighted: {
    fontWeight: '600'
  }
});
