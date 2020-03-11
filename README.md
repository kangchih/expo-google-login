# React native with google login and firebase 

- Learn how to add Expo(Version 36.0.0) Google Login to your app and save it to your Firebase Realtime Database 

### Reference:
* [React Native Firebase Tutorials #1](https://www.youtube.com/watch?v=ZcaQJoXY-3Q&list=PLy9JCsy2u97nVN5GxrjC6rv9XfyxoDtB_)
* [React Native Firebase Tutorials #2](https://www.youtube.com/watch?v=GZKaVJEd4JU&list=PLy9JCsy2u97nVN5GxrjC6rv9XfyxoDtB_&index=2)
* https://docs.expo.io/versions/v36.0.0/sdk/google/
* https://reactnavigation.org/docs/react-native-screens/

### Install Dependencies

* expo init your-project-name
* cd your-project-name
* npm install --save react-navigation
* expo install react-native-gesture-handler
* npm install expo-google-app-auth
* npm install --save firebase
* expo install react-native-screens
* npm install
* expo start


### Configure config.js 
```sh
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: ''
};
```

### Package name must be 'host.exp.exponent' if runs in local!!