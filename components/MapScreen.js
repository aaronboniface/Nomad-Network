import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'native-base';
import * as Expo from 'expo';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

import Users from './Users';
import MenuWrapper from './MenuWrapper';
import MapScreenStyles from '../styles/MapScreen.styles';
// import mockUsers from '../mockUsers';

const { getUserLocation, filterUsersByDistance } = require('../Functionality/utilityFunctions');

export default class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerLeft: (
      <Button
        iconLeft
        transparent
        onPress={() => {
          navigation.getParam('drawerStatus')();
        }}
        width={50}
      >
        <Icon type="FontAwesome" name="bars" />
      </Button>
    ),
  });

  state = {
    locationAndError: null,
    dev: false, // special dev variable for computer emulators
    // which can't use GPS.
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // This is just a dev thing if any computers are using emulators without GPS.
        // It sets a default GPS position somewhere near the middle of Manchester.
        // REMOVE FOR PRODUCTION:
        if (this.state.dev) {
          this.setState({
            currentUser,
            locationAndError: { location: { latitude: 53.4758302, longitude: -2.2465945 } },
            nearbyUsers: [],
          });
          // ---------------
        } else {
          getUserLocation(currentUser, (err, locationAndError) => {
            this.setState(
              {
                currentUser,
                locationAndError,
              },
              () => {
                filterUsersByDistance(this.state.currentUser, (err, nearbyUsers) => {
                  const nearbyUsersArray = Object.entries(nearbyUsers);
                  this.setState({ nearbyUsers: nearbyUsersArray });
                });
              },
            );
          });
        }
      } else {
        // presumably some type of error handling?
        this.setState({
          currentUser,
          locationAndError: { location: { latitude: 37.422, longitude: -122.084 } },
        });
      }
    });
  }

  render() {
    const { locationAndError, nearbyUsers, currentUser } = this.state;
    const { navigation } = this.props;
    if (!locationAndError || !nearbyUsers) {
      return (
        <View style={MapScreenStyles.container}>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MenuWrapper navigation={navigation}>
          <>
            <Expo.MapView
              style={{ flex: 3 }}
              provider={Expo.MapView.PROVIDER_GOOGLE}
              initialRegion={{
                latitude: locationAndError.location.latitude,
                longitude: locationAndError.location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Expo.MapView.Marker
                coordinate={locationAndError.location}
                title="you are here: "
                pinColor="blue"
              />
              <Expo.MapView.Circle
                center={locationAndError.location}
                radius={1500}
                fillColor="rgba(204, 210, 192, 0.5)"
                style={{ opacity: 0.5 }}
              />
            </Expo.MapView>

            <Users
              style={{ flex: 1 }}
              currentUser={currentUser}
              users={nearbyUsers}
              onSelectUser={(user) => {
                navigation.navigate('Profile', { selectedUser: user, currentUser, nearbyUsers });
              }}
            />
          </>
        </MenuWrapper>
      </View>
    );
  }
}

MapScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
