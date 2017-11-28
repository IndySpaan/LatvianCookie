import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentRoutePoints: [],
        coords: [],
        initialPosition: {
          latitude: 0,
          latitudeDelta: 0,
          longitude: 0,
          longitudeDelta: 0
        }
    };
  }

  watchID: ?number = null

  componentDidMount() {
    const refMap = this.refs.googleMap;

    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.setState({initialPosition: initialRegion});

    }, (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000})

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      }

      this.setState({initialPosition:lastRegion})
      // this.getDirections(lastRegion, SecondLocation);
      this.drawPointsTest(this.circleRoute(10000));

    });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  Init() {
    const { initialPosition } = this.state;
    const myOptions = {
      zoom: 17,
      center: new google.maps.LatLng(initialPosition),
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

  drawPointsTest(points) {
    const { initialPosition } = this.state;
    let coords = points.map((point, index) => {
      return  {
          latitude : point.latitude + point.latitudeDelta,
          longitude : point.longitude + point.longitudeDelta
      }
    })
    coords.splice(0, 0, initialPosition);
    coords.push(initialPosition);
    this.setState({coords: coords});
  }


  async getDirections(startLoc, destinationLoc) {
    try {
        console.debug(startLoc);
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
        console.log(coords);
        return coords
    } catch(error) {
        alert(error)
        return error
    }
  }

  circleRoute(length)
  {
    const { initialPosition } = this.state;
    //alert("Doing a circular route");
    const mapPoints = [];
    const radius = length/2/Math.PI;
    //log ("The radius of the circle is " + radius);
    const circlePoints = 4;
    const deg = [];
    const center = initialPosition;
    //Choose a direction for this value
    let direction = Math.random()*2*Math.PI;  //in radians
    //log("The direction of this point with be at " + direction*180/Math.PI + " degrees.");
  
    //Locate the point that is radius meters away from the Base Location in the direction chosen.
    //length assumed in meters, and then deltas in degrees.
    let dx = radius*Math.cos(direction);
    let dy = radius*Math.sin(direction);
    let delta_lat = dy/110540;
    let delta_lng = dx/(111320*Math.cos(initialPosition.latitude * Math.PI/180));
    //log(" The center point will be at " + center);
    //placeMarker(center,'Circle Center');
  
    //Find circlePoints other points to use
    //First, call the initial direction direction+180, since we are looking in the opposite direction.
    deg[0] = direction + Math.PI;
    
    let sign = -1;
    for(let i=1;i<circlePoints+1;i++)
      {
        deg[i] = deg[i-1] + sign*2*Math.PI/(circlePoints+1);
        dx = radius*Math.cos(deg[i]);
        dy = radius*Math.sin(deg[i]);
        delta_lat = dy/110540;
        delta_lng = dx/(111320*Math.cos(initialPosition.latitude*Math.PI/180));
        let mapObj = {
          latitude: initialPosition.latitude,
          latitudeDelta: delta_lat,
          longitude : initialPosition.longitude,
          longitudeDelta : delta_lng
        };
        // console.debug(new google.maps.LatLng(initialPosition.latitude+delta_lat,initialPosition.longitude+delta_lng));
        mapPoints.push(mapObj);
        //placeMarker(pts[i-1],'p'+i);
      }
      console.debug(mapPoints);
      return mapPoints;
  }

  render() {
    const { initialPosition } = this.state;

    return (
      <View style={styles.container}>
        <MapView
            style={styles.map}
            region={initialPosition}
            ref='googleMap'
        >
        <MapView.Marker
            coordinate={{latitude: initialPosition.latitude, longitude: initialPosition.longitude}}
            title={"Hi This is you!"}
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
