import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import Secret from '../secret';
import GoogleSignInButton from '../components/GoogleSignInButton';
import FacebookSignInButton from '../components/FacebookSignInButton';
import * as Facebook from 'expo-facebook';
import secret from '../secret';


class LoginScreen extends Component {
  isUserEqual = (user, firebaseUser) => {
    if (firebaseUser) {
      console.log('[LoginScreen][isUserEqual] firebaseUser=', firebaseUser);

      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === user.getBasicProfile().getId()
        ) {
          console.log('[LoginScreen][isUserEqual] isUserEqual=true');
          // No need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = user => {
    console.log('[LoginScreen][onSignin] Google Auth Response. user=', user);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        console.log('[LoginScreen][onSignin] Ready to unsubscribe()');
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(user, firebaseUser)) {
          console.log('[LoginScreen][onSignin] user != firebaseUser. Build Firebase credential with the Google ID token.');


          // console.log(`[LoginScreen][onSignin] user.token:${user.token}`);
          // console.log(`[LoginScreen][onSignin] user.token!=null:${(typeof user.token !== "undefined")}`);
          // console.log(`[LoginScreen][onSignin] user.idToken:${user.idToken}`);
          // console.log(`[LoginScreen][onSignin] user.idToken=="undefined":${(typeof user.idToken === "undefined")}`);
          // console.log(`[LoginScreen][onSignin] end=:${((typeof user.idToken == "undefined" && typeof user.token !== "undefined"))}`);


          // Build Firebase credential with the Google or Facebook token.
          var credential = (user.token) ?
            firebase.auth.FacebookAuthProvider.credential(user.token) :
            firebase.auth.GoogleAuthProvider.credential(user.idToken, user.accessToken
            );

          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              console.log('[LoginScreen][onSignin][FirebaseAuth] User signed in');
              console.log('[LoginScreen][onSignin][FirebaseAuth] result=', result);
              console.log(`[LoginScreen][onSignin][FirebaseAuth] isNewUser=${result.additionalUserInfo.isNewUser}`);

              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    email: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    name: result.additionalUserInfo.profile.name,
                    // last_name: result.additionalUserInfo.profile.family_name,
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
        console.log('[LoginScreen][signInWithGoogleAsync] Ready to signIn');
        console.log('[LoginScreen][signInWithGoogleAsync] result=', result);

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

  // async function logIn() {
  signInWithFacebookAsync = async () => {
    try {
      console.log('[LoginScreen][signInWithFacebookAsync]');
      await Facebook.initializeAsync(secret.facebookAppId);
      // const {
      //   type,
      //   token,
      //   expires,
      //   permissions,
      //   declinedPermissions,
      // } = await Facebook.logInWithReadPermissionsAsync({
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success') {
        console.log('[LoginScreen][signInWithFacebookAsync] Ready to signIn');
        console.log('[LoginScreen][signInWithFacebookAsync] result=', result);
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
        console.log('[LoginScreen][signInWithGoogleAsync] Logged in!', `Hi ${(await response.json())}!`);
        this.onSignIn(result);
        return result.token;
      } else {
        // type === 'cancel'
        return { cancelled: true };
      }
    } catch ({ message }) {
      console.log('[LoginScreen][signInWithGoogleAsync] err message=', message);
      return { error: true };
    }
  };
  
  render() {
    return (
      <View style={styles.container}>
        <View style={{ margin: 20 }}>
          <GoogleSignInButton onPress={() => this.signInWithGoogleAsync()}>
            Sign in with Google
        </GoogleSignInButton>
        </View>
        <View>
          <FacebookSignInButton onPress={() => this.signInWithFacebookAsync()}>
            Sign in with Facebook
        </FacebookSignInButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  googleProfileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  image: { width: 128, borderRadius: 64, aspectRatio: 1 },
  text: { color: 'black', fontSize: 16, fontWeight: '600' },
});

export default LoginScreen;