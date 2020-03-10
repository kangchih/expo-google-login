import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import Secret from '../secret';
class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      console.log('[LoginScreen][isUserEqual] firebaseUser=', firebaseUser);

      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          console.log('[LoginScreen][isUserEqual] isUserEqual=true');
          // No need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    console.log('[LoginScreen][onSignin] Google Auth Response. googleUser=', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        console.log('[LoginScreen][onSignin] Ready to unsubscribe()');
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          console.log('[LoginScreen][onSignin] googleUser != firebaseUser. Build Firebase credential with the Google ID token.');

          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              console.log('[LoginScreen][onSignin][FirebaseAuth] User signed in');
              console.log('[LoginScreen][onSignin][FirebaseAuth] result.additionalUserInfo.isNewUser=',
                result.additionalUserInfo.isNewUser);

              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function (snapshot) {
                    console.log('[LoginScreen][onSignin][FirebaseAuth] Snapshot', snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log("[LoginScreen][Error] err=", errorCode);
            });
        } else {
          console.log('[LoginScreen][onSignin][FirebaseAuth] User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      console.log('[LoginScreen][signInWithGoogleAsync]');

      const result = await Google.logInAsync({
        // behavior: 'web',
        iosClientId: Secret.iosClientId, 
        androidClientId: Secret.androidClientId, 
        scopes: ['profile', 'email']
      });

      console.log('[LoginScreen][signInWithGoogleAsync] result.type=', result.type);

      if (result.type === 'success') {
        console.log('[LoginScreen][signInWithGoogleAsync] Ready to onSignIn');
        this.onSignIn(result);
        return result.accessToken;
      } else {
        console.log('[LoginScreen][signInWithGoogleAsync] result=failed. Return cancelled:true');
        return { cancelled: true };
      }
    } catch (e) {
      console.log('[LoginScreen][signInWithGoogleAsync] err=', e);
      return { error: true };
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Login With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoginScreen;
