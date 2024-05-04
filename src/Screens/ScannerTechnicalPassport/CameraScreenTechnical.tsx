import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import Colors from '../../Includes/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Defs, Mask, Rect, Svg} from 'react-native-svg';
import {Text} from 'react-native';
import {
  SendTechnicalPassportPayload,
  sendTechnicalPassportRequest,
} from './sendTechnicalPassportSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {User, useAuth} from '../../Context/AuthContext';

type FlashType = 'auto' | 'off' | 'on' | undefined;
type PageType = 'first' | 'second';

const CameraTechnicalComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const {token, addRegisterData} = useAuth();
  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const {width, height} = useWindowDimensions();
  const [flash, setFlash] = useState<FlashType>('off');
  const [page, setPage] = useState<PageType>('first');
  const {loading} = useSelector(
    (state: RootState) => state.sendTechnicalPassportSlice,
  );
  let imageData = useRef<string[]>([]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(console.log).catch(console.warn);
    }
  }, [hasPermission, requestPermission]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const onChangeFlash = useCallback(() => {
    setFlash(prevFlash => (prevFlash === 'on' ? 'off' : 'on'));
  }, []);

  // let imageData: string[] = [];
  const takePhoto = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePhoto({
          flash: flash,
          enableAutoDistortionCorrection: true,
          enableAutoRedEyeReduction: true,
          enableShutterSound: true,
        });
        let imagePath =
          Platform.OS === 'ios' ? data?.path : 'file://' + data.path;

        if (imagePath !== '' && page === 'first') {
          imageData.current = [...imageData.current, imagePath];
          setPage('second');
        } else if (imagePath && page === 'second') {
          imageData.current = [...imageData.current, imagePath];
          setPage('first');
        }

        function isSendDriverLicensePayload(
          payload: any,
        ): payload is SendTechnicalPassportPayload {
          return (
            typeof payload === 'object' &&
            payload !== null &&
            'status' in payload &&
            'data' in payload
          );
        }

        if (imageData.current.length === 2) {
          dispatch(
            sendTechnicalPassportRequest({
              image1: imageData.current[0],
              image2: imageData.current[1],
              token,
            }),
          ).then(result => {
            if (isSendDriverLicensePayload(result.payload)) {
              const payload: SendTechnicalPassportPayload = result.payload;
              if (payload.status) {
                const userData: User = {
                  car_license_front_photo:
                    payload.data?.car_license_front_photo,
                  car_license_back_photo: payload.data?.car_license_back_photo,
                };
                addRegisterData(userData);

                navigation.navigate('DataAuto');
              }
            }
          });
          imageData.current = [];
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }, [addRegisterData, dispatch, flash, navigation, page, token]);

  const format = useCameraFormat(device, [
    {autoFocusSystem: 'contrast-detection'},
    {iso: 'max'},
  ]);

  return (
    <View style={styles.container}>
      <Modal visible={loading} transparent={true}>
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.black} size={'large'} />
        </View>
      </Modal>
      <AntDesign
        name={'arrowleft'}
        color={Colors.white}
        style={[styles.goBack, {top: insets.top + 10}]}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <View
        style={[
          styles.cameraTextParent,
          {
            top: insets.top + 70,
          },
        ]}>
        <Text style={styles.cameraText}>
          {page === 'first' ? 'СТС передняя часть' : 'СТС Задняя часть'}
        </Text>
      </View>
      {device && hasPermission && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.cameraFrame,
            {
              top: width / 2.5,
              height: height / 1.7,
              width: width - 100,
            },
          ]}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            photo={true}
            resizeMode={'cover'}
            focusable={true}
            isActive={isFocused}
            format={format}
            // frameProcessor={frameProcessor}
            pixelFormat={'yuv'}
          />
        </View>
      )}
      <Svg width={'100%'} height={'100%'} style={styles.svg}>
        <Defs>
          <Mask id={'mask'} width={'100%'} height={'100%'} x={0} y={0}>
            <Rect width={'100%'} height={'100%'} fill={Colors.white} />
            <Rect
              x={50}
              y={width / 2.5}
              height={height / 1.7}
              width={width - 100}
              fill={Colors.black}
            />
          </Mask>
        </Defs>

        <Rect
          width={'100%'}
          height={'100%'}
          fill={'rgba(0,0,0,0.8)'}
          mask={'url(#mask)'}
        />

        <Rect
          x={50}
          y={width / 2.5}
          height={height / 1.7}
          width={width - 100}
          fill={'transparent'}
          strokeWidth={3}
          stroke={Colors.white}
        />
      </Svg>
      {device && (
        <TouchableOpacity
          onPress={takePhoto}
          activeOpacity={0.6}
          style={[styles.cameraButton, {bottom: insets.bottom + 10}]}>
          <Entypo name={'camera'} color={Colors.darker} size={30} />
        </TouchableOpacity>
      )}
      {device && (
        <TouchableOpacity
          onPress={onChangeFlash}
          activeOpacity={0.6}
          style={[
            styles.flashStyle,
            {
              bottom: insets.bottom + 20,
              backgroundColor:
                flash === 'on' ? Colors.white : Colors.whiteOpacity,
            },
          ]}>
          <Entypo
            name={'flash'}
            color={flash === 'on' ? Colors.lightYellow : Colors.darker}
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.whiteOpacity,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBack: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  cameraTextParent: {
    position: 'absolute',
    zIndex: 1,
  },
  cameraText: {
    color: Colors.white,
  },
  cameraFrame: {
    left: 50,
  },
  camera: {flex: 1},
  cameraButton: {
    position: 'absolute',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darker,
  },
  flashStyle: {
    position: 'absolute',
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 50,
    left: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darker,
  },
  svg: {
    position: 'absolute',
  },
});

export const CameraScreenTechnical = memo(CameraTechnicalComponent);
