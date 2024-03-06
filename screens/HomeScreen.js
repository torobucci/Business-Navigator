import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';



const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Home screen</Text>
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

export default HomeScreen;

