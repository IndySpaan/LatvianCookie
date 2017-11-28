import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import { TextField } from 'react-native-material-textfield';


class RouteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '',};
  }

  componentWillUpdate() {
    const { text } = this.state;
    console.debug('Text / value in texbox is : ' + text);
  }


  render() {
    let {text} = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          value={text}
          placeholder={'Input the distance to run.'}
          onChangeText={(text) => this.setState({text})}
          style={styles.input}
          keyboardType={'numeric'}
        />
        <TouchableOpacity onPress={() => Actions.mapScreen()}>
            <Text
              style={styles.buttonText}
            >
              Generate a new route!
            </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
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
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  }
});

export default RouteScreen;
