import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, View, Platform } from 'react-native';

const googleIcon = {
  uri:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png',
};

let TouchableCmp = TouchableOpacity;

if (Platform.OS === 'android' && Platform.Version >= 21) {
  TouchableCmp = TouchableNativeFeedback;
}

export default class GoogleSignInButton extends React.PureComponent {
  static defaultProps = {
    onPress() { },
  };

  render() {
    const { children, style, ...props } = this.props;
    return (
      <TouchableCmp
        activeOpacity={0.6}
        style={StyleSheet.flatten([styles.touchable, style])}
        {...props}
      >
        <View style={styles.content}>
          <Image source={googleIcon} style={styles.icon} />
          <Text style={styles.text}>{children}</Text>
        </View>
      </TouchableCmp>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    shadowOpacity: 0.26,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    // overflow: 'visible',
    overflow: Platform.OS === 'android' && Platform.Version >= 21 
    ? 'hidden'
    : 'visible',
    elevation: 5, 
    shadowColor: 'black',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: { width: 26, aspectRatio: 1 },
  text: {
    color: 'gray',
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'roboto-medium'
  },
});
