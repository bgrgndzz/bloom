import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Text
} from 'react-native';

import Input from '../../shared/Input/Input';

import FontAwesome from '../../shared/FontAwesome/FontAwesome';

export default class Dropdown extends Component {
  render() {
    const {field, data, focused, placeholder, searchKey, onChange, onPress, toggle} = this.props;

    return (
      <React.Fragment>
        <Modal
          visible={focused}
          onRequestClose={toggle}
          animationType="slide"
        >
          <View style={styles.schoolModal}>
            <FlatList
              style={styles.schools}
              contentContainerStyle={styles.schoolsContent}
              showsVerticalScrollIndicator={false}
              data={field ? data.filter(option => (searchKey ? option[searchKey] : option)
                .replace('İ', 'i').toLowerCase()
                .indexOf(
                  field.replace('İ', 'i').toLowerCase()
                ) > -1) : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.school}
                  onPress={() => onPress(item)}
                >
                  <Text style={styles.schoolName}>{searchKey ? item[searchKey] : item}</Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={(
                <View style={styles.modalHeading}>
                  <Input
                    containerStyle={styles.modalInputContainer}
                    clearButtonMode="while-editing"
                    value={field}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.schoolSubmitButton}
                    onPress={toggle}
                  >
                    <FontAwesome
                      style={styles.schoolSubmitIcon}
                      icon="check"
                    />
                  </TouchableOpacity>
                </View>
              )}
              stickyHeaderIndices={[0]}
            />
          </View>
        </Modal>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  schoolModal: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  modalHeading: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 0
  },
  modalInputContainer: { flex: 1 },
  schoolSubmitButton: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  schoolSubmitIcon: {
    fontSize: 20,
    color: '#16425B'
  },
  schools: { flex: 1 },
  schoolsContent: {
    marginTop: -15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  school: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  schoolName: {
    flex: 1,
    color: '#202020',
    fontWeight: '100',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
