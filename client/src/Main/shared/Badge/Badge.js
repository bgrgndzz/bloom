import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

const styles = StyleSheet.create({
  bigBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bigBadgeText: {},
  bigBadgeIcon: {
    width: undefined,
    aspectRatio: 1,
    marginRight: 3
  },
  smallBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  smallBadgeText: {},
  smallBadgeIcon: {
    width: undefined,
    aspectRatio: 1,
    marginRight: 2
  }
});

const badges = {
  beta: {
    icon: require('../../../images/logo.png'),
    text: 'beta',
    big: {
      containerStyle: {
        backgroundColor: '#16425B',
        height: 25,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 25
      },
      textStyle: {
        color: 'white',
        fontWeight: '700',
        lineHeight: 18,
        fontSize: 18,
        marginLeft: -1
      },
      iconStyle: {
        height: 15
      }
    },
    small: {
      containerStyle: {
        backgroundColor: '#16425B',
        height: 15,
        paddingVertical: 2.5,
        paddingHorizontal: 5,
        borderRadius: 15
      },
      textStyle: {
        color: 'white',
        fontWeight: '700',
        lineHeight: 12.5,
        fontSize: 12.5,
        marginLeft: -1
      },
      iconStyle: {
        height: 10
      }
    }
  }
};

const Badge = props => {
  const { icon, text } = badges[props.badge];
  const { containerStyle, textStyle, iconStyle } = badges[props.badge][props.size];
  return (
    <View style={[styles[`${props.size}BadgeContainer`], containerStyle]}>
      <Image
        style={[styles[`${props.size}BadgeIcon`], iconStyle]}
        source={icon}
        resizeMode="contain"
      />
      <Text style={[styles[`${props.size}BadgeText`], textStyle]}>{text}</Text>
    </View>
  );
};

export default Badge;
