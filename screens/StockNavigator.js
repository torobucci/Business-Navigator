// StockNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StockScreen from './StockScreen';
import NewStockScreen from './NewStockScreen';

const Stack = createStackNavigator();

const StockNavigator = () => (
  <Stack.Navigator mode="modal" headerMode="none">
    <Stack.Screen name="Stock" component={StockScreen} />
    <Stack.Screen name="NewStock" component={NewStockScreen} />
  </Stack.Navigator>
);

export default StockNavigator;
