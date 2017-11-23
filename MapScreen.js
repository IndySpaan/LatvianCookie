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
import Polyline from '@mapbox/polyline';

const StartLocation = {
    latitude: 51.441642,
    longitude: 5.4697225,
    latitudeDelta: 0.0055,
    longitudeDelta: 0.0055,
};

const SecondLocation = {
  latitude: 51.435821,
  longitude: 5.479430,
  latitudeDelta: 0.0055,
  longitudeDelta: 0.0055,
};

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentRoutePoints: [],
        coords: []
    };
  }
  
  componentDidMount() {
    const refMap = this.refs.googleMap;
    
    console.debug(this.getDirections(StartLocation, SecondLocation));

  }

  Init() {
    const myOptions = {
      zoom: 17,
      center: new google.maps.LatLng(37.2008385157313, -93.2812106609344),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID,
            google.maps.MapTypeId.SATELLITE]
      },
      disableDoubleClickZoom: true,
      scrollwheel: false,
      draggableCursor: "crosshair"
    }
  
    const map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    const poly = new google.maps.Polyline({ map: map });
    google.maps.event.addListener(map, "click", function(evt) {
      if (path.getLength() === 0) {
        path.push(evt.latLng);
        poly.setPath(path);
      } else {
        service.route({
          origin: path.getAt(path.getLength() - 1),
          destination: evt.latLng,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = result.routes[0].overview_path.length;
                i < len; i++) {
              path.push(result.routes[0].overview_path[i]);
            }
          }
        });
      }
    });
  }

  
  async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc.latitude + ',' + startLoc.longitude }&destination=${ destinationLoc.latitude + ',' + destinationLoc.longitude }`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        this.setState({coords: coords})
        return coords
    } catch(error) {
        alert(error)
        return error
    }
  }

  generateRoute(length) {
    
      //How far is it to your fixed point?
      var distToFixed = computeDistanceBetween(BaseLocation,fixedPoints[0].marker.getPosition());
    
      if(distToFixed/requestedLengthInMeters > 0.5)
        {
          alert("The distance requested is less than half the straight line distance to the fixed waypoint.  No way to close a route.");
        }
    
      else
        {
          var brngToFixed = getBearing(BaseLocation,fixedPoints[0].marker.getPosition());
          /* Now, choose a direction in which to head, and go the distance such that the sum of the 3 legs 
         (base to fixed, fixed to next, next to base) add up to the desired distance, length. */
          var minTurn = 20;  var maxTurn = 160;
          var direction = Math.random()* (maxTurn-minTurn) + minTurn;
          var side = Math.floor(2*Math.random());
          if(side==0) direction = direction;
          if(side==1) direction = -1* direction;
          var newBearing = brngToFixed + direction * Math.PI/180;
          var step = 0;
          var toHere;
          var allLegs = 0;
          while(allLegs < length)
        {
          step += 1;  //Move out in steps of 1 meter.
          toHere = getNewPointAlongBearing(fixedPoints[0].marker.getPosition(),step,newBearing);
          allLegs = distToFixed + computeDistanceBetween(fixedPoints[0].marker.getPosition(),toHere) + computeDistanceBetween(toHere,BaseLocation);
        }
    
          var newBearing2 = newBearing + (1-side*2)*5*Math.PI/180;
          var toHere2 = getNewPointAlongBearing(fixedPoints[0].marker.getPosition(),step,newBearing2);
    
          /*
          placeMarker(toHere,"");
          new google.maps.Polyline({path:[BaseLocation,fixedPoints[0].marker.getPosition()],map:map});
          new google.maps.Polyline({path:[fixedPoints[0].marker.getPosition(),toHere],map:map});
          new google.maps.Polyline({path:[toHere,BaseLocation],map:map});
          */
          
          rlPoints.length=0;
          rlPoints.push(fixedPoints[0].marker.getPosition());
          rlPoints.push(toHere);
          rlPoints.push(toHere2);
        }
    
      return;
    }

  render() {

    return (
      <View style={styles.container}>
        <MapView
            style={styles.map}
            initialRegion={StartLocation}
            ref='googleMap'
        >
        <MapView.Circle
            center={{latitude: StartLocation.latitude, longitude: StartLocation.longitude}}
            radius={1500}
            fillColor="rgba(0, 0, 0, 0.2)"
            strokeColor="rgba(0, 0, 0, 0.2)"/>
        <MapView.Marker
            coordinate={{latitude: StartLocation.latitude, longitude: StartLocation.longitude}}
            title={"TEST MARKER"}
        />
        <MapView.Marker
            coordinate={{latitude: SecondLocation.latitude, longitude: SecondLocation.longitude}}
            title={"SECOND MARKER"}
        />
        <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red"/>
        </MapView>
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
