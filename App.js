import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import HomeScreen from './HomeScreen';
import RouteScreen from './RouteScreen';
import MapScreen from './MapScreen';

const App = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="home"
          component={HomeScreen}
          title="Home"
          hideNavBar={true}
          initial
        />
        <Scene key="routeScreen"
          component={RouteScreen}
          title="Route"
        />
        <Scene key="mapScreen"
          component={MapScreen}
          title="Maps"
        />
      </Scene>
    </Router>
  );
}

export default App;