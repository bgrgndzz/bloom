import React, {Component} from 'react';
import {
  StyleSheet, 
  View, 
  Dimensions
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';

export default class Dropdown extends Component {
  render() {
    const width = this.props.width || '100%';
    const props = {
      style: styles.input,
      dropdownStyle: styles.dropdown,
      defaultValue: this.props.defaultValue,
      onSelect: this.props.onSelect,
      options: this.props.options
    };
    return (
      <View style={[styles.inputContainer, {width}]}>
        <ModalDropdown {...props} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    marginBottom: 25
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  dropdown: {
    width: Dimensions.get('window').width - 85,
    marginTop: 10,
    marginLeft: -12.5,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 5}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 'auto',
    maxHeight: 400
  }
});