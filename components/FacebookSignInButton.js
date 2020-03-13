import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, View, Platform } from 'react-native';

const facebookIcon = {
  uri:
    'https://upload.wikimedia.org/wikipedia/commons/0/07/Facebook_logo.png'
};

let TouchableCmp = TouchableOpacity;

if (Platform.OS === 'android' && Platform.Version >= 21) {
  TouchableCmp = TouchableNativeFeedback;
}

export default class FacebookSignInButton extends React.PureComponent {
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
          <Image source={facebookIcon} style={styles.icon} />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: { width: 26, aspectRatio: 1 },
  text: {
    color: 'gray',
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'roboto-medium',
  },
});
