import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    console.log("[LoadingScreen][checkIfLoggedIn]")
    firebase.auth().onAuthStateChanged(
      function (user) {
        console.log('[LoadingScreen][checkIfLoggedIn] User=', { user })
        if (user) {
          console.log('[LoadingScreen][checkIfLoggedIn] User\'s logged in');
          this.props.navigation.navigate('DashboardScreen');
        } else {
          console.log('[LoadingScreen][checkIfLoggedIn] User is null. Go to login screen');

          this.props.navigation.navigate('LoginScreen');
        }
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});