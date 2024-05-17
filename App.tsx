/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {AuthProvider} from './src/Context/AuthContext';
import RootNavigation from './src/Router/RootNavigation';
import {BackHandler, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';

enableScreens();

const App = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

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
              <FlashMessage position={'top'} />
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
