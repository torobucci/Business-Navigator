import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/FontAwesome5';

import AuthNavigator from './screens/AuthNavigator';
import HomeScreen from './screens/HomeScreen';
import SalesScreen from './screens/SalesScreen';
import StockNavigator from './screens/StockNavigator';
import ExpensesScreen from './screens/ExpensesScreen';
import ProfitLossScreen from './screens/ProfitLossScreen';
import { database } from './firebaseConfig';
import { set, ref } from 'firebase/database';


const Tab = createBottomTabNavigator();

const App = () => {

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const writeUserData = (userId, name, email) => {
    set(ref(database, 'users/' + userId), {
      username: name,
      email: email,
    });
  }
  const addNewShop = (userId,shopId, name, category) => {
    set(ref(database,`users/${userId}/shops/${shopId}` + shopId), {
      name: name,
      category:category,
    });
  }


  useEffect(() => {
    // Write data to the database
    writeUserData(1, 'kevin', 'kevintoro254@gmail.com')
    addNewShop(1,1,'Kiboino Complex','shop')
  }, []);

  useEffect(() => {
    // Add your authentication check logic here
    // Example: Check if the user is authenticated, update setUserAuthenticated accordingly
    // You might want to use Firebase authentication or your preferred authentication method
    // For demo purposes, I'll assume the user is not authenticated initially
    setUserAuthenticated(false);
  }, []);

  return (
    <>
      {!userAuthenticated &&
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Home'
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'Sales':
                    iconName = 'chart-bar';
                    break;
                  case 'Stock':
                    iconName = 'cubes';
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
              activeTintColor: 'blue',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name="Stock" component={StockNavigator} />
            <Tab.Screen name="Sales" component={SalesScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} />
            <Tab.Screen name="Profit/Loss" component={ProfitLossScreen} />
          </Tab.Navigator>
        </NavigationContainer>}
      {userAuthenticated &&
        <AuthNavigator />
      }
    </>
  );
};

export default App;
