import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';

//Fix "Firebase App named '[DEFAULT]' already exists" issue
if (!firebase.apps.length) {
  console.log("[App] Firebase.apps=", firebase.apps);
  console.log("[App] Ready to initializeApp firebase.apps.length=", firebase.apps.length);
  firebase.initializeApp(firebaseConfig);
} else {
  console.log("[App] Firebase.apps=", firebase.apps);
  console.log("[App] Ready to firebase.app() firebase.apps.length=", firebase.apps.length);
  firebase.app();
}
// export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

export default function App() {
  return <AppNavigator />;
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: {screen: LoadingScreen},
  LoginScreen: {screen: LoginScreen},
  DashboardScreen: {screen: DashboardScreen}
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});