/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {AuthProvider} from './src/Context/AuthContext';
import RootNavigation from './src/Router/RootNavigation';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

enableScreens();

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
              <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
              />
              <RootNavigation />
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
