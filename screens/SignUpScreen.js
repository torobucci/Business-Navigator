// SignUpScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';


const SignUpScreen = () => {
  const handleSignUp = () => {
    // Handle sign-up logic
    // Navigate to HomeScreen if sign-up is successful
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up Screen</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;
