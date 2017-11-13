import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import MapView from 'react-native-maps';


class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '',};
  }

  getInitialState() {
    return {
      region: new MapView.AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
  }
  
  onRegionChange(region) {
    this.state.region.setValue(region);
  }

  render() {
    let {text} = this.state;
    return (
      <View style={styles.container}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  }
});

export default MapScreen;
