import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerStandard}>

      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => Actions.routeScreen()}>
          <View style={styles.button}>
            <Text
              style={styles.buttonText}
            >
              Generate a new route!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStandard: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  row: {
    padding: 20,
    backgroundColor: '#253a4b',
  },
  headerArea: {
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f33b5f',
    padding: 15,
    borderRadius: 100,
    elevation: 3,
    marginLeft: 20,
    marginRight: 20
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#fff',
  },
});

export default HomeScreen;