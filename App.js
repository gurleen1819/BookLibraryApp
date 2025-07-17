import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BookListScreen from './screens/BookListScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import BorrowedBooksScreen from './screens/BorrowedBooksScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
     
      <Stack.Screen
        name="BookList"
        component={BookListScreen}
        options={{ title: 'Book Library' }}
      />
    
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: 'Book Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, 
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'book-outline';
            else if (route.name === 'Borrowed') iconName = 'bookmark-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
     
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Borrowed" component={BorrowedBooksScreen} options={{ title: 'Borrowed Books' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
