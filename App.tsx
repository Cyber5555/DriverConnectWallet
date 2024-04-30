/* eslint-disable react-native/no-inline-styles */
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigation from './src/Router/RootNavigation';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {AuthProvider} from './src/Context/AuthContext';

enableScreens();

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <AuthProvider>
          <Provider store={store}>
            <NavigationContainer>
              <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'default'}
              />
              <RootNavigation />
            </NavigationContainer>
          </Provider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
