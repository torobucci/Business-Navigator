import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpensesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Expenses Screen</Text>
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

export default ExpensesScreen;
