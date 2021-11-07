import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { AuthProvider } from './src/context/AuthContext';

const AppState = ({ children }: {children: JSX.Element | JSX.Element[]}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 


const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  )
}

export default App;