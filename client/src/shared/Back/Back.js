import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import FontAwesome from '../FontAwesome/FontAwesome';

export default class Back extends Component {
  state = {
    disabled: false
  }

  onPress = () => this.setState({ disabled: true }, this.props.onPress);

  render() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        disabled={this.state.disabled}
      >
        <FontAwesome
          style={styles.back}
          icon="chevronLeft"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  back: {
    fontSize: 25,
    color: '#16425B'
  }
});
