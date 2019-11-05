import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import { CachedImage } from 'react-native-cached-image';

import defaultprofile from '../../../images/defaultprofile.png';

import Badge from '../Badge/Badge';

const highlight = (string, search) => string && string.split(new RegExp(search, 'gi')).map((splitName, index, array) => [
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

const styles = StyleSheet.create({
  user: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  name: {
    color: '#202020',
    fontWeight: '300',
    lineHeight: 30,
    marginRight: 10
  },
  highlighted: {
    fontWeight: '600'
  }
});

const User = (props) => ((props.user && props.user.user) ? (
  <View style={styles.user}>
    {props.user.user.profilepicture ? (
      <CachedImage
        style={styles.profilepicture}
        source={{ uri: `https://www.getbloom.info/uploads/profilepictures/${props.user.user.profilepicture}` }}
        resizeMode="contain"
      />
    ) : (
      <Image
        style={styles.profilepicture}
        source={defaultprofile}
        resizeMode="contain"
      />
    )}
    <Text style={styles.name}>
      {
        props.search ?
          highlight(`${props.user.user.firstName} ${props.user.user.lastName}`, props.search) :
          `${props.user.user.firstName} ${props.user.user.lastName}`
      }
    </Text>
    {props.user.user.mainBadge ? (
      <Badge
        badge={props.user.user.mainBadge}
        size="small"
      />
    ) : null}
  </View>
) : null);

export default User;
