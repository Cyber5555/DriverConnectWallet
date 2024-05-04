/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {AuthProvider} from './src/Context/AuthContext';
import RootNavigation from './src/Router/RootNavigation';

enableScreens();

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <AuthProvider>
            <RootNavigation />
          </AuthProvider>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
