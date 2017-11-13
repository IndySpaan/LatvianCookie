import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code


class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '',};
  }

  render() {
    let {text} = this.state;
    return (
      <View style={styles.container}>
        <Text>Mapscreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#1c1c1c',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.7)',
    fontSize: 30,
    color: '#FFF',
    marginHorizontal: 20,
    marginTop: 10


  }
});

export default MapScreen;
