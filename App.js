import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator, StackCardInterpolatedStyle } from '@react-navigation/stack';
import Home from './Home'; 
import Options  from './Options';

export default function App() {
  
  return (
    
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Home" >
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Options" component={Options}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
