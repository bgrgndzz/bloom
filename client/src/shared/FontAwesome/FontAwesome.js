import React, {Component} from 'react';
import {Text} from 'react-native';

import icons from './icons.js';

export default class FontAwesome extends Component {
  render() {
    return (
      <Text style={[
        this.props.style,
        {fontFamily: 'FontAwesome5Free' + icons[this.props.icon].type}
      ]}>
        {icons[this.props.icon].code}
      </Text>
    ); 
  }
};