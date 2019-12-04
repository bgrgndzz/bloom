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
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 25
  },
  bigBadgeText: {
    fontWeight: '700',
    fontSize: 17,
    textAlignVertical: 'center'
  },
  bigBadgeIcon: {
    width: undefined,
    aspectRatio: 1,
    marginRight: 3
  },
  smallBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 15,
    paddingHorizontal: 5,
    borderRadius: 15
  },
  smallBadgeText: {
    fontWeight: '700',
    fontSize: 12.5,
    textAlignVertical: 'center'
  },
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
        backgroundColor: '#16425B'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 15
      }
    },
    small: {
      containerStyle: {
        backgroundColor: '#16425B'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 10
      }
    }
  },
  jsninja: {
    icon: null,
    text: 'JS Ninja',
    big: {
      containerStyle: {
        backgroundColor: '#F7DF1D'
      },
      textStyle: {
        color: 'black'
      },
      iconStyle: {
        height: 0
      }
    },
    small: {
      containerStyle: {
        backgroundColor: '#F7DF1D'
      },
      textStyle: {
        color: 'black'
      },
      iconStyle: {
        height: 0
      }
    }
  },
  sensei: {
    icon: require('../../../images/badges/sensei.png'),
    text: 'Sensei',
    big: {
      containerStyle: {
        backgroundColor: 'black'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 20,
        marginRight: 2
      }
    },
    small: {
      containerStyle: {
        backgroundColor: 'black'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 13,
        marginRight: 1
      }
    }
  },
  mekaninsahibi: {
    icon: null,
    text: 'Mekanın Sahibi',
    big: {
      containerStyle: {
        backgroundColor: 'black'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 0
      }
    },
    small: {
      containerStyle: {
        backgroundColor: 'black'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 0
      }
    }
  },
  davetkar: {
    icon: require('../../../images/badges/davetkar.png'),
    text: 'Davetkar',
    big: {
      containerStyle: {
        backgroundColor: '#EA3546'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 17.5
      }
    },
    small: {
      containerStyle: {
        backgroundColor: '#EA3546'
      },
      textStyle: {
        color: 'white'
      },
      iconStyle: {
        height: 12.5
      }
    }
  },
};

const Badge = props => {
  if (!badges[props.badge]) return null;

  const { icon, text } = badges[props.badge];
  const { containerStyle, textStyle, iconStyle } = badges[props.badge][props.size];
  return (
    <View style={[styles[`${props.size}BadgeContainer`], containerStyle]}>
      {icon ? (
        <Image
          style={[styles[`${props.size}BadgeIcon`], iconStyle]}
          source={icon}
          resizeMode="contain"
        />
      ) : null}
      <Text style={[styles[`${props.size}BadgeText`], textStyle]}>{text}</Text>
    </View>
  );
};

export default Badge;
