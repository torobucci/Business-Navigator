import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductScreen from './ProductScreen';
import NewProductScreen from './NewProductScreen';

const Stack = createStackNavigator();

const ProductNavigator = ({ route }) => {
  const { userId } = route.params
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Product" component={ProductScreen} initialParams={{ userId: userId }} />
      <Stack.Screen name="NewProduct" component={NewProductScreen} initialParams={{ userId: userId }} />
    </Stack.Navigator>
  )
};

export default ProductNavigator;
