import React, {Component} from 'react';
import {
  StyleSheet, 
  TouchableOpacity, 
  Image
} from 'react-native';

export default class Back extends Component {
  state = {
    disabled: false
  }

  onPress = () => {
    this.setState({disabled: true}, () => {
      this.props.animationPresets['Landing']();
    });
  }

  render() {
    return (
      <TouchableOpacity 
        onPress={this.onPress}
        disabled={this.state.disabled}
      >
        <Image 
          source={require('../../images/back--blue.png')}
          style={styles.back}
          resizeMode="contain"
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  back: {
    width: 20,
    height: 20,
    marginRight: 'auto'
  }
});