import React, { Component } from 'react';
import { Text } from 'react-native';

import icons from './icons';

const FontAwesome = props => (
  <Text
    style={Array.isArray(props.style) ? [
      { fontFamily: 'FontAwesome5FreeSolid' },
      ...props.style
    ] : [
      { fontFamily: 'FontAwesome5FreeSolid' },
      props.style
    ]}
  >
    {icons[props.icon]}
  </Text>
);

export default FontAwesome;
