import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';
import GoogleSignInButton from '../components/GoogleSignInButton';

const DashboardScreen = props => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>DashboardScreen</Text>
      <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}

// class GoogleProfile extends React.PureComponent {
//   render() {
//     const { photoURL, displayName, email } = this.props;
//     return (
//       <View style={styles.container}>
//         {photoURL && (
//           <Image
//             source={{
//               uri: photoURL,
//             }}
//             style={styles.image}
//           />
//         )}
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.text}>{displayName}</Text>
//           <Text style={styles.text}>{email}</Text>
//         </View>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DashboardScreen;
