import { View, Text, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

export default function App() {

  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        setHasLocationPermission(true);
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('position', position);
          const options = {
            method: 'GET',
            url: `https://us1.locationiq.com/v1/reverse.php?key=pk.07864eb9866426e27817bc571e67ac2c&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
          };
          axios.request(options).then(function (response) {
            console.log('axios', response.data);
          }).catch(function (error) {
            console.error(error);
          });
        }, (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

  }, [hasLocationPermission])

  return (
    <View>
      <Text>App</Text>
    </View>
  )
}