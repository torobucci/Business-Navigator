import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/FontAwesome5';

import HomeScreen from './screens/HomeScreen';
import SalesScreen from './screens/SalesScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import ProfitLossScreen from './screens/ProfitLossScreen';
import ProductNavigator from './screens/ProductNavigator';
import LoginScreen from './screens/LoginScreen';

import CustomHeader from './screens/child-components/CustomHeader';

import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './screens/child-components/CustomDrawerContent';
import { useSelector } from 'react-redux';
const Drawer = createDrawerNavigator();


const Tab = createBottomTabNavigator();

const App = () => {


  const [userId, setUserId] = useState(null)
  const userAuthenticated = useSelector((state) => state.users.userAuthenticated);
  const shopId = useSelector((state) => state.shopId.shopId);

  const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Products':
                iconName = 'cubes';
                break;
              case 'Sales':
                iconName = 'chart-bar';
                break;
              case 'Home':
                iconName = 'home';
                break;
              case 'Expenses':
                iconName = 'money-bill';
                break;
              case 'Profit/Loss':
                iconName = 'calculator';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#1DA1F2',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Products"
          component={ProductNavigator}
          initialParams={{ userId: userId, shopId: shopId }}
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} shopId={shopId} title="Products" />,
          }}
        />
        <Tab.Screen
          name="Sales"
          component={SalesScreen}
          initialParams={{ userId: userId, shopId: shopId }}
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} shopId={shopId} title="Sales" />,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ userId: userId, shopId: shopId }}
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} shopId={shopId} title="Home" />,
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpensesScreen}
          initialParams={{ userId: userId, shopId: shopId }}
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} shopId={shopId} title="Expenses" />,
          }}
        />
        <Tab.Screen
          name="Profit/Loss"
          component={ProfitLossScreen}
          initialParams={{ userId: userId, shopId: shopId }}
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} shopId={shopId} title="Profit/Loss" />,
          }}
        />
      </Tab.Navigator>
    );
  };



  return (
    <>
      {userAuthenticated &&
        <NavigationContainer>
          <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName="Home">
            <Drawer.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }}  />
          </Drawer.Navigator>
        </NavigationContainer>}
      {!userAuthenticated &&
        <LoginScreen setUserId={setUserId} />
      }
    </>
  );
};

export default App;
