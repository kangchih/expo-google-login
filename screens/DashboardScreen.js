import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';

const DashboardScreen = props => {
    return (
      <View style={styles.container}>
        <Text>DashboardScreen</Text>
        <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DashboardScreen;
