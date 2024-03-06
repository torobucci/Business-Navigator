import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
   <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
   </NavigationContainer>
  );
};

export default AuthNavigator;
