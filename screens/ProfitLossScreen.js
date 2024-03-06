import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfitLossScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Profit/Loss Screen</Text>
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

export default ProfitLossScreen;
